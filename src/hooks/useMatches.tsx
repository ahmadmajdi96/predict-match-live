import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  name_ar: string | null;
  logo_url: string | null;
  api_id: number | null;
}

interface Match {
  id: string;
  api_id: number | null;
  kickoff_time: string;
  home_score: number | null;
  away_score: number | null;
  status: string | null;
  stadium: string | null;
  referee: string | null;
  home_coach: string | null;
  away_coach: string | null;
  home_formation: string | null;
  away_formation: string | null;
  weather: string | null;
  home_team: Team | null;
  away_team: Team | null;
  league: {
    id: string;
    name: string;
    name_ar: string | null;
    prediction_price: number | null;
  } | null;
}

// Auto-sync interval: 6 hours
const SYNC_INTERVAL = 6 * 60 * 60 * 1000;
const LAST_SYNC_KEY = 'lastMatchesSync';

async function performSync() {
  console.log('Starting match sync...');
  
  try {
    // Sync teams first
    const teamsResponse = await supabase.functions.invoke('football-api', {
      body: { action: 'syncTeams', syncToDb: true, leagueId: '233' }
    });

    if (teamsResponse.error) {
      console.error('Teams sync error:', teamsResponse.error);
      throw new Error('Failed to sync teams');
    }

    console.log('Teams synced:', teamsResponse.data);

    // Sync matches
    const matchesResponse = await supabase.functions.invoke('football-api', {
      body: { action: 'syncMatches', syncToDb: true, leagueId: '233' }
    });

    if (matchesResponse.error) {
      console.error('Matches sync error:', matchesResponse.error);
      throw new Error('Failed to sync matches');
    }

    console.log('Matches synced:', matchesResponse.data);

    // Sync players
    const playersResponse = await supabase.functions.invoke('football-api', {
      body: { action: 'syncPlayers', syncToDb: true }
    });

    if (playersResponse.error) {
      console.error('Players sync error:', playersResponse.error);
      // Don't throw - players sync is optional
    } else {
      console.log('Players synced:', playersResponse.data);
    }

    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    return true;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

async function autoSyncIfNeeded() {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  const now = Date.now();
  
  if (lastSync && now - parseInt(lastSync) < SYNC_INTERVAL) {
    console.log('Skipping sync - synced recently');
    return false;
  }
  
  try {
    await performSync();
    return true;
  } catch (error) {
    console.error('Auto sync failed:', error);
    return false;
  }
}

export function useMatches(status?: string) {
  return useQuery({
    queryKey: ['matches', status],
    queryFn: async () => {
      // Check if we have matches
      const { count } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });
      
      // If no matches or very few, trigger auto-sync
      if (!count || count < 5) {
        console.log('No matches found, triggering sync...');
        await autoSyncIfNeeded();
      }
      
      let query = supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*),
          league:leagues(*)
        `)
        .order('kickoff_time', { ascending: true });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Match[];
    },
  });
}

export function useSyncMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      toast.loading('جاري مزامنة المباريات من API...', { id: 'sync' });
      await performSync();
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('تم تحديث المباريات واللاعبين بنجاح', { id: 'sync' });
    },
    onError: (error) => {
      console.error('Sync mutation error:', error);
      toast.error('فشل في تحديث المباريات', { id: 'sync' });
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Subscribe to realtime notifications
export function useRealtimeNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          const notification = payload.new as any;
          toast(notification.title, {
            description: notification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
