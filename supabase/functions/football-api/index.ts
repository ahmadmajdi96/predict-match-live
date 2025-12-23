import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API-Football Direct API (api-sports.io)
const API_BASE = 'https://v3.football.api-sports.io';

// Egyptian Premier League ID in API-Football
const EGYPTIAN_LEAGUE_ID = 233;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!apiKey) {
      console.error('RAPIDAPI_KEY not configured');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, leagueId, season, matchId } = await req.json();
    const currentSeason = season || '2023'; // Free API plan supports 2021-2023

    console.log(`Action: ${action}, League: ${leagueId || EGYPTIAN_LEAGUE_ID}, Season: ${currentSeason}`);

    const headers = {
      'x-apisports-key': apiKey,
    };

    // Helper function to safely fetch JSON
    const safeFetch = async (url: string) => {
      console.log('Fetching:', url);
      const response = await fetch(url, { headers });
      const text = await response.text();
      console.log('Response status:', response.status, 'Body preview:', text.slice(0, 300));
      
      if (!text || text.trim() === '') {
        console.log('Empty response');
        return null;
      }
      
      try {
        const data = JSON.parse(text);
        if (data.errors && Object.keys(data.errors).length > 0) {
          console.error('API errors:', JSON.stringify(data.errors));
        }
        console.log('Parsed results count:', data?.results);
        return data;
      } catch (e) {
        console.log('JSON parse error:', e);
        return null;
      }
    };

    // Get League Standings
    if (action === 'getStandings') {
      const url = `${API_BASE}/standings?league=${EGYPTIAN_LEAGUE_ID}&season=${currentSeason}`;
      const data = await safeFetch(url);
      
      console.log('Standings results:', data?.results);

      if (data?.response && data.response.length > 0) {
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If no standings, return the API errors for debugging
      return new Response(JSON.stringify({ 
        response: [], 
        errors: data?.errors,
        message: data?.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test API connection - list leagues
    if (action === 'testConnection') {
      const url = `${API_BASE}/leagues`;
      const data = await safeFetch(url);
      
      return new Response(JSON.stringify({
        success: data?.results > 0,
        results: data?.results,
        errors: data?.errors,
        message: data?.message,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Teams from API-Football
    if (action === 'syncTeams') {
      const url = `${API_BASE}/teams?league=${EGYPTIAN_LEAGUE_ID}&season=${currentSeason}`;
      const data = await safeFetch(url);
      
      console.log(`Fetched ${data?.results || 0} teams`);

      if (!data?.response || data.response.length === 0) {
        return new Response(JSON.stringify({ error: 'No teams found', apiErrors: data?.errors }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Ensure league exists
      const { data: existingLeague } = await supabase
        .from('leagues')
        .select('id')
        .eq('api_id', EGYPTIAN_LEAGUE_ID)
        .maybeSingle();

      let leagueUuid: string;
      if (!existingLeague) {
        const { data: newLeague, error: leagueError } = await supabase
          .from('leagues')
          .insert({
            api_id: EGYPTIAN_LEAGUE_ID,
            name: 'Egyptian Premier League',
            name_ar: 'الدوري المصري الممتاز',
            country: 'Egypt',
            is_active: true,
            prediction_price: 0
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

      const { error: teamsError } = await supabase
        .from('teams')
        .upsert(teamsToUpsert, { onConflict: 'api_id' });

      if (teamsError) {
        console.error('Teams upsert error:', teamsError);
        throw teamsError;
      }

      console.log(`Synced ${teamsToUpsert.length} teams`);

      return new Response(JSON.stringify({ 
        success: true, 
        teamsCount: teamsToUpsert.length,
        teams: teamsToUpsert.map((t: any) => t.name)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Matches from API-Football
    if (action === 'syncMatches') {
      // Get league from database
      let { data: league } = await supabase
        .from('leagues')
        .select('id')
        .eq('api_id', EGYPTIAN_LEAGUE_ID)
        .maybeSingle();

      if (!league) {
        const { data: newLeague } = await supabase
          .from('leagues')
          .insert({
            api_id: EGYPTIAN_LEAGUE_ID,
            name: 'Egyptian Premier League',
            name_ar: 'الدوري المصري الممتاز',
            country: 'Egypt',
            is_active: true,
          })
          .select()
          .single();
        league = newLeague;
      }

      if (!league) {
        return new Response(JSON.stringify({ error: 'Failed to create league' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // First sync teams
      const teamsUrl = `${API_BASE}/teams?league=${EGYPTIAN_LEAGUE_ID}&season=${currentSeason}`;
      const teamsData = await safeFetch(teamsUrl);
      
      if (teamsData?.response && teamsData.response.length > 0) {
        const teamsToUpsert = teamsData.response.map((item: any) => ({
          api_id: item.team.id,
          name: item.team.name,
          name_ar: getArabicTeamName(item.team.name),
          logo_url: item.team.logo,
          league_id: league.id
        }));

        await supabase.from('teams').upsert(teamsToUpsert, { onConflict: 'api_id' });
        console.log(`Synced ${teamsToUpsert.length} teams`);
      }

      // Get fixtures from API
      const url = `${API_BASE}/fixtures?league=${EGYPTIAN_LEAGUE_ID}&season=${currentSeason}`;
      const data = await safeFetch(url);
      
      console.log(`Fetched ${data?.results || 0} fixtures`);

      if (!data?.response || data.response.length === 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'No fixtures found',
          apiErrors: data?.errors 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get all teams mapping
      const { data: teams } = await supabase
        .from('teams')
        .select('id, api_id')
        .eq('league_id', league.id);

      const teamMap = new Map(teams?.map(t => [t.api_id, t.id]) || []);

      // Map fixtures to matches
      const matchesToUpsert = data.response
        .filter((fixture: any) => {
          const homeId = fixture.teams.home.id;
          const awayId = fixture.teams.away.id;
          return teamMap.has(homeId) && teamMap.has(awayId);
        })
        .map((fixture: any) => {
          let status = 'upcoming';
          const fixtureStatus = fixture.fixture.status.short;
          
          if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(fixtureStatus)) {
            status = 'live';
          } else if (['FT', 'AET', 'PEN'].includes(fixtureStatus)) {
            status = 'finished';
          } else if (['PST', 'CANC', 'ABD', 'AWD', 'WO'].includes(fixtureStatus)) {
            status = 'postponed';
          }

          return {
            api_id: fixture.fixture.id,
            league_id: league.id,
            home_team_id: teamMap.get(fixture.teams.home.id),
            away_team_id: teamMap.get(fixture.teams.away.id),
            kickoff_time: fixture.fixture.date,
            home_score: fixture.goals.home,
            away_score: fixture.goals.away,
            status,
            stadium: fixture.fixture.venue?.name || null,
            referee: fixture.fixture.referee || null,
          };
        });

      console.log(`Prepared ${matchesToUpsert.length} matches for upsert`);

      if (matchesToUpsert.length > 0) {
        const { error: matchesError } = await supabase
          .from('matches')
          .upsert(matchesToUpsert, { onConflict: 'api_id' });

        if (matchesError) {
          console.error('Matches upsert error:', matchesError);
          throw matchesError;
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        matchesCount: matchesToUpsert.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get live matches
    if (action === 'getLiveMatches') {
      const url = `${API_BASE}/fixtures?live=all&league=${EGYPTIAN_LEAGUE_ID}`;
      const data = await safeFetch(url);
      
      return new Response(JSON.stringify(data || { response: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get match details with lineups and stats
    if (action === 'getMatchDetails') {
      const [fixtureData, lineupsData, statsData] = await Promise.all([
        safeFetch(`${API_BASE}/fixtures?id=${matchId}`),
        safeFetch(`${API_BASE}/fixtures/lineups?fixture=${matchId}`),
        safeFetch(`${API_BASE}/fixtures/statistics?fixture=${matchId}`),
      ]);

      return new Response(JSON.stringify({
        fixture: fixtureData?.response?.[0],
        lineups: lineupsData?.response,
        statistics: statsData?.response,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Players
    if (action === 'syncPlayers') {
      const { data: teams } = await supabase
        .from('teams')
        .select('id, api_id')
        .not('api_id', 'is', null);

      if (!teams || teams.length === 0) {
        return new Response(JSON.stringify({ error: 'No teams found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let totalPlayers = 0;

      for (const team of teams.slice(0, 5)) { // Limit to 5 teams to avoid rate limits
        try {
          const playersData = await safeFetch(
            `${API_BASE}/players/squads?team=${team.api_id}`
          );
          const players = playersData?.response?.[0]?.players || [];

          console.log(`Fetched ${players.length} players for team ${team.api_id}`);

          if (players.length > 0) {
            const playersToUpsert = players.map((p: any, index: number) => ({
              api_id: p.id,
              team_id: team.id,
              name: p.name,
              jersey_number: p.number || index + 1,
              position: mapPosition(p.position),
              photo_url: p.photo,
              is_substitute: index >= 11,
            }));

            const { error: playersError } = await supabase
              .from('players')
              .upsert(playersToUpsert, { onConflict: 'api_id' });

            if (!playersError) {
              totalPlayers += playersToUpsert.length;
            }
          }

          // Rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (teamError) {
          console.error(`Error fetching players for team ${team.api_id}:`, teamError);
        }
      }

      return new Response(JSON.stringify({ success: true, playersCount: totalPlayers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapPosition(position: string): string {
  if (!position) return 'MF';
  const pos = position.toLowerCase();
  if (pos.includes('goal') || pos.includes('keeper')) return 'GK';
  if (pos.includes('defend') || pos.includes('back')) return 'DF';
  if (pos.includes('mid')) return 'MF';
  if (pos.includes('forward') || pos.includes('striker') || pos.includes('attack')) return 'FW';
  return 'MF';
}

function getArabicTeamName(englishName: string): string {
  const arabicNames: Record<string, string> = {
    'Al Ahly SC': 'الأهلي',
    'Al Ahly': 'الأهلي',
    'Zamalek SC': 'الزمالك',
    'Zamalek': 'الزمالك',
    'Pyramids FC': 'بيراميدز',
    'Pyramids': 'بيراميدز',
    'Al Masry': 'المصري',
    'Al Masry Club': 'المصري',
    'Ismaily SC': 'الإسماعيلي',
    'Ismaily': 'الإسماعيلي',
    'Ceramica Cleopatra': 'سيراميكا كليوباترا',
    'Ceramica Cleopatra FC': 'سيراميكا كليوباترا',
    'Future FC': 'فيوتشر',
    'Smouha SC': 'سموحة',
    'Smouha': 'سموحة',
    'Pharco FC': 'فاركو',
    'Pharco': 'فاركو',
    'ENPPI': 'إنبي',
    'Enppi': 'إنبي',
    'National Bank of Egypt': 'البنك الأهلي',
    'National Bank': 'البنك الأهلي',
    'Eastern Company SC': 'الشركة الشرقية',
    'Eastern Company': 'الشركة الشرقية',
    'El Gouna FC': 'الجونة',
    'El Gouna': 'الجونة',
    'Ghazl El Mahalla': 'غزل المحلة',
    'Ghazl El Mahallah': 'غزل المحلة',
    'Al Ittihad Alexandria': 'الاتحاد السكندري',
    'Al Ittihad': 'الاتحاد السكندري',
    'Ittihad El Iskandary': 'الاتحاد السكندري',
    'Tala\'ea El Gaish': 'طلائع الجيش',
    'Talaea El Gaish': 'طلائع الجيش',
    'El Gaish': 'طلائع الجيش',
    'Haras El Hodoud': 'حرس الحدود',
    'ZED FC': 'زد',
    'Zed FC': 'زد',
    'Al Mokawloon Al Arab': 'المقاولون العرب',
    'Al Mokawloon': 'المقاولون العرب',
    'Arab Contractors': 'المقاولون العرب',
    'Misr Lel Makkasa': 'مصر للمقاصة',
    'El Dakhleya': 'الداخلية',
    'Petrojet': 'بتروجيت',
    'Modern Sport': 'مودرن سبورت',
  };
  
  return arabicNames[englishName] || englishName;
}
