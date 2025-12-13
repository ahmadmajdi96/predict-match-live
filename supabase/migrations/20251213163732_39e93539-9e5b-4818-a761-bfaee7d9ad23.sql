-- Fix security definer view by replacing with a regular function-based approach
DROP VIEW IF EXISTS public.leaderboard;

-- Create a secure function to get leaderboard instead
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  avatar_url TEXT,
  total_points BIGINT,
  total_predictions BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.display_name,
    p.avatar_url,
    COALESCE(SUM(pr.points_earned), 0)::BIGINT as total_points,
    COUNT(pr.id)::BIGINT as total_predictions
  FROM public.profiles p
  LEFT JOIN public.predictions pr ON p.id = pr.user_id
  GROUP BY p.id, p.display_name, p.avatar_url
  ORDER BY total_points DESC;
$$;

-- Fix the update_updated_at_column function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();