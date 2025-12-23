import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TheSportsDB API - Free tier
const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
// Egyptian Premier League ID in TheSportsDB
const EGYPTIAN_LEAGUE_ID = '4829';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, leagueId, season, syncToDb } = await req.json();
    const currentSeason = season || '2024-2025';

    console.log(`Action: ${action}, Season: ${currentSeason}`);

    // Get League Table/Standings
    if (action === 'getStandings') {
      const response = await fetch(
        `${SPORTSDB_BASE}/lookuptable.php?l=${EGYPTIAN_LEAGUE_ID}&s=${currentSeason}`
      );
      const data = await response.json();
      console.log('Standings response:', JSON.stringify(data).slice(0, 500));

      if (data.table && data.table.length > 0) {
        // Transform to match our expected format
        const standings = data.table.map((team: any, index: number) => ({
          rank: parseInt(team.intRank) || index + 1,
          team: {
            id: team.idTeam,
            name: team.strTeam,
            logo: team.strBadge || team.strTeamBadge,
          },
          points: parseInt(team.intPoints) || 0,
          goalsDiff: parseInt(team.intGoalDifference) || 0,
          all: {
            played: parseInt(team.intPlayed) || 0,
            win: parseInt(team.intWin) || 0,
            draw: parseInt(team.intDraw) || 0,
            lose: parseInt(team.intLoss) || 0,
            goals: {
              for: parseInt(team.intGoalsFor) || 0,
              against: parseInt(team.intGoalsAgainst) || 0,
            },
          },
          form: team.strForm || '',
        }));

        return new Response(JSON.stringify({ 
          response: [{ league: { standings: [standings] } }] 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ response: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Teams from TheSportsDB
    if (action === 'syncTeams') {
      const url = `${SPORTSDB_BASE}/lookup_all_teams.php?id=${EGYPTIAN_LEAGUE_ID}`;
      console.log('Fetching teams from:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Fetched ${data.teams?.length || 0} teams`);
      console.log('First team sample:', JSON.stringify(data.teams?.[0]).slice(0, 200));

      if (!data.teams || data.teams.length === 0) {
        return new Response(JSON.stringify({ error: 'No teams found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Ensure league exists
      const { data: existingLeague } = await supabase
        .from('leagues')
        .select('id')
        .eq('api_id', parseInt(EGYPTIAN_LEAGUE_ID))
        .maybeSingle();

      let leagueUuid: string;
      if (!existingLeague) {
        const { data: newLeague, error: leagueError } = await supabase
          .from('leagues')
          .insert({
            api_id: parseInt(EGYPTIAN_LEAGUE_ID),
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

      const teamsToUpsert = data.teams.map((team: any) => ({
        api_id: parseInt(team.idTeam),
        name: team.strTeam,
        name_ar: getArabicTeamName(team.strTeam),
        logo_url: team.strBadge || team.strTeamBadge,
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
        teamsCount: teamsToUpsert.length 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Matches - Get past and upcoming events
    if (action === 'syncMatches') {
      // Get league info
      const { data: league } = await supabase
        .from('leagues')
        .select('id')
        .eq('api_id', parseInt(EGYPTIAN_LEAGUE_ID))
        .maybeSingle();

      if (!league) {
        // First sync teams
        console.log('League not found, syncing teams first...');
        const teamsResponse = await fetch(
          `${SPORTSDB_BASE}/lookup_all_teams.php?id=${EGYPTIAN_LEAGUE_ID}`
        );
        const teamsData = await teamsResponse.json();

        if (teamsData.teams) {
          const { data: newLeague } = await supabase
            .from('leagues')
            .insert({
              api_id: parseInt(EGYPTIAN_LEAGUE_ID),
              name: 'Egyptian Premier League',
              name_ar: 'الدوري المصري الممتاز',
              country: 'Egypt',
              is_active: true,
            })
            .select()
            .single();

          if (newLeague) {
            const teamsToUpsert = teamsData.teams.map((team: any) => ({
              api_id: parseInt(team.idTeam),
              name: team.strTeam,
              name_ar: getArabicTeamName(team.strTeam),
              logo_url: team.strBadge,
              league_id: newLeague.id
            }));

            await supabase.from('teams').upsert(teamsToUpsert, { onConflict: 'api_id' });
          }
        }
      }

      // Re-fetch league
      const { data: leagueData } = await supabase
        .from('leagues')
        .select('id')
        .eq('api_id', parseInt(EGYPTIAN_LEAGUE_ID))
        .maybeSingle();

      if (!leagueData) {
        return new Response(JSON.stringify({ error: 'Failed to create league' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get all teams mapping
      const { data: teams } = await supabase
        .from('teams')
        .select('id, api_id')
        .eq('league_id', leagueData.id);

      const teamMap = new Map(teams?.map(t => [t.api_id, t.id]) || []);

      let allEvents: any[] = [];

      // Get past events (last 15)
      const pastResponse = await fetch(
        `${SPORTSDB_BASE}/eventspastleague.php?id=${EGYPTIAN_LEAGUE_ID}`
      );
      const pastData = await pastResponse.json();
      if (pastData.events) {
        allEvents = [...allEvents, ...pastData.events];
      }
      console.log(`Fetched ${pastData.events?.length || 0} past events`);

      // Get next events (next 15)
      const nextResponse = await fetch(
        `${SPORTSDB_BASE}/eventsnextleague.php?id=${EGYPTIAN_LEAGUE_ID}`
      );
      const nextData = await nextResponse.json();
      if (nextData.events) {
        allEvents = [...allEvents, ...nextData.events];
      }
      console.log(`Fetched ${nextData.events?.length || 0} next events`);

      // Get schedule for current season
      const scheduleResponse = await fetch(
        `${SPORTSDB_BASE}/eventsseason.php?id=${EGYPTIAN_LEAGUE_ID}&s=${currentSeason}`
      );
      const scheduleData = await scheduleResponse.json();
      if (scheduleData.events) {
        // Add events that aren't already in allEvents
        const existingIds = new Set(allEvents.map(e => e.idEvent));
        for (const event of scheduleData.events) {
          if (!existingIds.has(event.idEvent)) {
            allEvents.push(event);
          }
        }
      }
      console.log(`Total unique events: ${allEvents.length}`);

      // Map events to matches
      const matchesToUpsert = allEvents
        .filter((event: any) => {
          const homeId = parseInt(event.idHomeTeam);
          const awayId = parseInt(event.idAwayTeam);
          return teamMap.has(homeId) && teamMap.has(awayId);
        })
        .map((event: any) => {
          const homeId = parseInt(event.idHomeTeam);
          const awayId = parseInt(event.idAwayTeam);
          
          // Determine status
          let status = 'upcoming';
          const eventStatus = event.strStatus?.toLowerCase() || '';
          const homeScore = event.intHomeScore;
          const awayScore = event.intAwayScore;
          
          if (eventStatus.includes('live') || eventStatus.includes('progress')) {
            status = 'live';
          } else if (homeScore !== null && awayScore !== null && homeScore !== '' && awayScore !== '') {
            status = 'finished';
          } else if (eventStatus.includes('postponed') || eventStatus.includes('cancelled')) {
            status = 'postponed';
          }

          // Build kickoff time
          let kickoffTime = event.strTimestamp || `${event.dateEvent}T${event.strTime || '00:00:00'}`;
          if (!kickoffTime.includes('T')) {
            kickoffTime = `${event.dateEvent}T${event.strTime || '18:00:00'}`;
          }

          return {
            api_id: parseInt(event.idEvent),
            league_id: leagueData.id,
            home_team_id: teamMap.get(homeId),
            away_team_id: teamMap.get(awayId),
            kickoff_time: kickoffTime,
            home_score: homeScore !== null && homeScore !== '' ? parseInt(homeScore) : null,
            away_score: awayScore !== null && awayScore !== '' ? parseInt(awayScore) : null,
            status,
            stadium: event.strVenue || null,
            referee: event.strReferee || null,
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
        pastEvents: pastData.events?.length || 0,
        nextEvents: nextData.events?.length || 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sync Players - Get players for all teams
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

      for (const team of teams) {
        try {
          const playersResponse = await fetch(
            `${SPORTSDB_BASE}/lookup_all_players.php?id=${team.api_id}`
          );
          const playersData = await playersResponse.json();
          const players = playersData.player || [];

          console.log(`Fetched ${players.length} players for team ${team.api_id}`);

          if (players.length > 0) {
            const playersToUpsert = players.map((p: any, index: number) => ({
              api_id: parseInt(p.idPlayer),
              team_id: team.id,
              name: p.strPlayer,
              jersey_number: parseInt(p.strNumber) || index + 1,
              position: mapPosition(p.strPosition),
              photo_url: p.strCutout || p.strThumb,
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
          await new Promise((resolve) => setTimeout(resolve, 200));
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
  if (pos.includes('forward') || pos.includes('striker') || pos.includes('wing')) return 'FW';
  return 'MF';
}

function getArabicTeamName(englishName: string): string {
  const arabicNames: Record<string, string> = {
    'Al Ahly': 'الأهلي',
    'Al Ahly SC': 'الأهلي',
    'Al-Ahly': 'الأهلي',
    'Zamalek': 'الزمالك',
    'Zamalek SC': 'الزمالك',
    'Pyramids FC': 'بيراميدز',
    'Pyramids': 'بيراميدز',
    'Al Masry': 'المصري',
    'Al Masry Club': 'المصري',
    'Al-Masry': 'المصري',
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
    'Ittihad El Iskandary': 'الاتحاد السكندري',
    'Tala\'ea El Gaish': 'طلائع الجيش',
    'Talaea El Gaish': 'طلائع الجيش',
    'El Gaish': 'طلائع الجيش',
    'Haras El Hodoud': 'حرس الحدود',
    'El Hodod': 'حرس الحدود',
    'Zed FC': 'زد',
    'ZED FC': 'زد',
    'Al Mokawloon': 'المقاولون العرب',
    'Al Mokawloon Al Arab': 'المقاولون العرب',
    'Arab Contractors': 'المقاولون العرب',
    'Misr Lel Makkasa': 'مصر للمقاصة',
    'Nogoom FC': 'نجوم',
    'El Dakhleya': 'الداخلية',
    'Petrojet': 'بتروجيت',
    'El Sharkia': 'الشرقية',
    'Modern Sport': 'مودرن سبورت',
  };
  
  return arabicNames[englishName] || englishName;
}
