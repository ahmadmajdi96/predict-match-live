-- Add expenses table for admin
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies for expenses
CREATE POLICY "Admins can manage expenses"
ON public.expenses
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add contest settings table for prizes and points
CREATE TABLE public.contest_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.contest_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for contest_settings
CREATE POLICY "Anyone can view contest settings"
ON public.contest_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage contest settings"
ON public.contest_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Insert default contest settings
INSERT INTO public.contest_settings (setting_key, setting_value, description) VALUES
('points_exact_score', '{"value": 10}'::jsonb, 'Points for exact score prediction'),
('points_correct_result', '{"value": 5}'::jsonb, 'Points for correct result (win/draw/lose)'),
('points_first_scorer', '{"value": 5}'::jsonb, 'Points for correct first scorer prediction'),
('points_total_corners', '{"value": 3}'::jsonb, 'Points for correct total corners prediction'),
('points_total_cards', '{"value": 3}'::jsonb, 'Points for correct total cards prediction'),
('prize_first_place', '{"value": 1000, "currency": "EGP"}'::jsonb, 'Prize for 1st place winner'),
('prize_second_place', '{"value": 500, "currency": "EGP"}'::jsonb, 'Prize for 2nd place winner'),
('prize_third_place', '{"value": 250, "currency": "EGP"}'::jsonb, 'Prize for 3rd place winner');

-- Add match details columns to matches table
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS referee TEXT,
ADD COLUMN IF NOT EXISTS stadium TEXT,
ADD COLUMN IF NOT EXISTS home_coach TEXT,
ADD COLUMN IF NOT EXISTS away_coach TEXT,
ADD COLUMN IF NOT EXISTS weather TEXT,
ADD COLUMN IF NOT EXISTS match_details JSONB DEFAULT '{}';

-- Add trigger for updated_at on contest_settings
CREATE TRIGGER update_contest_settings_updated_at
BEFORE UPDATE ON public.contest_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();