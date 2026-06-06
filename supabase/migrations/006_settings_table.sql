-- Table des paramètres généraux
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Index
CREATE INDEX idx_settings_key ON public.settings(key);

-- Trigger updated_at
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales
INSERT INTO public.settings (key, value) VALUES
  ('club_name', '"Racing Club de Bingerville"'),
  ('active_season', '"2025-2026"'),
  ('competitions', '["CHAMPIONNAT", "COUPE", "AMICAL"]'),
  ('notifications_email', 'true'),
  ('notifications_sms', 'false'),
  ('notification_email_address', '"admin@racingclub.ci"')
ON CONFLICT (key) DO NOTHING;
