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

export function useMatches(status?: string) {
  return useQuery({
    queryKey: ['matches', status],
    queryFn: async () => {
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
        console.error('Error fetching matches:', error);
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
      // First sync teams
      const teamsResponse = await supabase.functions.invoke('football-api', {
        body: { action: 'syncTeams', syncToDb: true, leagueId: '233' }
      });

      if (teamsResponse.error) {
        throw new Error('Failed to sync teams');
      }

      // Then sync matches
      const matchesResponse = await supabase.functions.invoke('football-api', {
        body: { action: 'syncMatches', syncToDb: true, leagueId: '233' }
      });

      if (matchesResponse.error) {
        throw new Error('Failed to sync matches');
      }

      return matchesResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('تم تحديث المباريات بنجاح');
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('فشل في تحديث المباريات');
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
          // Show toast for new notification
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
