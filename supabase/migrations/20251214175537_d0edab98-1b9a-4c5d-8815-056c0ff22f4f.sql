-- Add unique constraint on api_id for teams table for upsert functionality
ALTER TABLE public.teams ADD CONSTRAINT teams_api_id_unique UNIQUE (api_id);