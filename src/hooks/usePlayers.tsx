import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Player {
  id: string;
  name: string;
  name_ar: string | null;
  position: string | null;
  jersey_number: number | null;
  is_substitute: boolean | null;
  photo_url: string | null;
}

export function useTeamPlayers(teamId: string | undefined) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn: async () => {
      if (!teamId) return { lineup: [], substitutes: [] };

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('jersey_number', { ascending: true });

      if (error) throw error;

      const lineup = (data || [])
        .filter((p: Player) => !p.is_substitute)
        .slice(0, 11)
        .map((p: Player) => ({
          id: p.id,
          name: p.name,
          nameAr: p.name_ar,
          number: p.jersey_number || 0,
          position: p.position || 'MF',
          photo: p.photo_url,
        }));

      const substitutes = (data || [])
        .filter((p: Player) => p.is_substitute)
        .map((p: Player) => ({
          id: p.id,
          name: p.name,
          nameAr: p.name_ar,
          number: p.jersey_number || 0,
          position: p.position || 'MF',
          photo: p.photo_url,
        }));

      return { lineup, substitutes };
    },
    enabled: !!teamId,
  });
}
