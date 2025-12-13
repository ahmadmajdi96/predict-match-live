import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { action, leagueId, fixtureId, season } = await req.json();
    const baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';

    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    };

    let endpoint = '';
    let params = new URLSearchParams();

    switch (action) {
      case 'getLeagues':
        endpoint = '/leagues';
        params.append('country', 'Egypt');
        break;

      case 'getFixtures':
        endpoint = '/fixtures';
        params.append('league', leagueId || '233'); // Egyptian Premier League
        params.append('season', season || '2024');
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
        params.append('season', season || '2024');
        break;

      case 'getPlayers':
        endpoint = '/players/squads';
        params.append('team', leagueId);
        break;

      case 'getStandings':
        endpoint = '/standings';
        params.append('league', leagueId || '233');
        params.append('season', season || '2024');
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch(`${baseUrl}${endpoint}?${params}`, { headers });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Football API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});