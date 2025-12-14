import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, leagueId, fixtureId, season, syncToDb } = await req.json();
    const baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';

    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    };

    let endpoint = '';
    let params = new URLSearchParams();
    const currentSeason = season || '2024';

    switch (action) {
      case 'getLeagues':
        endpoint = '/leagues';
        params.append('country', 'Egypt');
        break;

      case 'getFixtures':
        endpoint = '/fixtures';
        params.append('league', leagueId || '233');
        params.append('season', currentSeason);
        break;

      case 'getLiveFixtures':
        endpoint = '/fixtures';
        params.append('live', 'all');
        params.append('league', leagueId || '233');
        break;

      case 'getFixtureDetails':
        endpoint = '/fixtures';
        params.append('id', fixtureId);
        break;

      case 'getLineups':
        endpoint = '/fixtures/lineups';
        params.append('fixture', fixtureId);
        break;

      case 'getTeams':
        endpoint = '/teams';
        params.append('league', leagueId || '233');
        params.append('season', currentSeason);
        break;

      case 'getPlayers':
        endpoint = '/players/squads';
        params.append('team', leagueId);
        break;

      case 'getStandings':
        endpoint = '/standings';
        params.append('league', leagueId || '233');
        params.append('season', currentSeason);
        break;

      case 'syncMatches':
        endpoint = '/fixtures';
        params.append('league', leagueId || '233');
        params.append('season', currentSeason);
        break;

      case 'syncTeams':
        endpoint = '/teams';
        params.append('league', leagueId || '233');
        params.append('season', currentSeason);
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch(`${baseUrl}${endpoint}?${params}`, { headers });
    const data = await response.json();

    if (syncToDb && data.response) {
      if (action === 'syncTeams') {
        const { data: existingLeague } = await supabase
          .from('leagues')
          .select('id')
          .eq('api_id', parseInt(leagueId || '233'))
          .single();

        let leagueUuid: string;
        if (!existingLeague) {
          const { data: newLeague, error: leagueError } = await supabase
            .from('leagues')
            .insert({
              api_id: parseInt(leagueId || '233'),
              name: 'Egyptian Premier League',
              name_ar: 'الدوري المصري الممتاز',
              country: 'Egypt',
              is_active: true,
              prediction_price: 10
            })
            .select()
            .single();
          
          if (leagueError) throw leagueError;
          leagueUuid = newLeague.id;
        } else {
          leagueUuid = existingLeague.id;
        }

        const teamsToUpsert = data.response.map((item: any) => ({
          api_id: item.team.id,
          name: item.team.name,
          name_ar: getArabicTeamName(item.team.name),
          logo_url: item.team.logo,
          league_id: leagueUuid
        }));

        await supabase
          .from('teams')
          .upsert(teamsToUpsert, { onConflict: 'api_id' });
      }

      if (action === 'syncMatches') {
        const { data: league } = await supabase
          .from('leagues')
          .select('id')
          .eq('api_id', parseInt(leagueId || '233'))
          .single();

        if (!league) {
          throw new Error('League not found. Please sync teams first.');
        }

        const { data: teams } = await supabase
          .from('teams')
          .select('id, api_id')
          .eq('league_id', league.id);

        const teamMap = new Map(teams?.map(t => [t.api_id, t.id]) || []);

        const matchesToUpsert = data.response.map((fixture: any) => {
          const homeTeamUuid = teamMap.get(fixture.teams.home.id);
          const awayTeamUuid = teamMap.get(fixture.teams.away.id);

          let status = 'upcoming';
          if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(fixture.fixture.status.short)) {
            status = 'live';
          } else if (['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO'].includes(fixture.fixture.status.short)) {
            status = 'finished';
          }

          return {
            api_id: fixture.fixture.id,
            league_id: league.id,
            home_team_id: homeTeamUuid,
            away_team_id: awayTeamUuid,
            kickoff_time: fixture.fixture.date,
            home_score: fixture.goals.home,
            away_score: fixture.goals.away,
            status,
            stadium: fixture.fixture.venue?.name,
            referee: fixture.fixture.referee,
          };
        }).filter((m: any) => m.home_team_id && m.away_team_id);

        await supabase
          .from('matches')
          .upsert(matchesToUpsert, { onConflict: 'api_id' });
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getArabicTeamName(englishName: string): string {
  const arabicNames: Record<string, string> = {
    'Al Ahly': 'الأهلي',
    'Al Ahly SC': 'الأهلي',
    'Zamalek': 'الزمالك',
    'Zamalek SC': 'الزمالك',
    'Pyramids FC': 'بيراميدز',
    'Pyramids': 'بيراميدز',
    'Al Masry': 'المصري',
    'Al Masry Club': 'المصري',
    'Ismaily SC': 'الإسماعيلي',
    'Ismaily': 'الإسماعيلي',
    'Ceramica Cleopatra': 'سيراميكا كليوباترا',
    'Future FC': 'فيوتشر',
    'Smouha SC': 'سموحة',
    'Smouha': 'سموحة',
    'Pharco FC': 'فاركو',
    'Pharco': 'فاركو',
    'Enppi': 'إنبي',
    'ENPPI': 'إنبي',
    'National Bank': 'البنك الأهلي',
    'National Bank of Egypt': 'البنك الأهلي',
    'Eastern Company': 'الشركة الشرقية',
    'El Gouna FC': 'الجونة',
    'El Gouna': 'الجونة',
    'Ghazl El Mahallah': 'غزل المحلة',
    'Ghazl El Mahalla': 'غزل المحلة',
    'Al Ittihad Alexandria': 'الاتحاد السكندري',
    'Al Ittihad': 'الاتحاد السكندري',
    'Tala\'ea El Gaish': 'طلائع الجيش',
    'Talaea El Gaish': 'طلائع الجيش',
    'El Gaish': 'طلائع الجيش',
    'Haras El Hodoud': 'حرس الحدود',
    'El Hodod': 'حرس الحدود',
    'Zed FC': 'زد',
    'ZED FC': 'زد',
    'Al Mokawloon': 'المقاولون العرب',
    'Al Mokawloon Al Arab': 'المقاولون العرب',
    'Misr Lel Makkasa': 'مصر للمقاصة',
    'Nogoom FC': 'نجوم',
  };
  
  return arabicNames[englishName] || englishName;
}
