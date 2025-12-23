-- Enable pg_net extension if not exists (pg_cron should already be enabled)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;