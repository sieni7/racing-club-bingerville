-- =====================================================
-- ADMIN V7 - site_sections, RLS, Storage
-- =====================================================

-- Table site_sections
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Données initiales
INSERT INTO public.site_sections (section_key, title, is_enabled, display_order) VALUES
  ('hero',           'Bannière principale',   true, 1),
  ('kpis',           'Statistiques clés',     true, 2),
  ('next_match',     'Prochain match',        true, 3),
  ('recent_results', 'Derniers résultats',    true, 4),
  ('top_scorers',    'Meilleurs buteurs',     true, 5),
  ('club_history',   'Notre Histoire',        true, 6),
  ('values',         'Nos valeurs',           true, 7),
  ('news',           'Actualités',            true, 8),
  ('gallery',        'Galerie photos',        true, 9),
  ('sponsors',       'Sponsors',              true, 10)
ON CONFLICT (section_key) DO NOTHING;

-- RLS site_sections
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique site_sections" ON public.site_sections
  FOR SELECT USING (true);

CREATE POLICY "Admin write site_sections" ON public.site_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- Ajout colonnes à actualites
ALTER TABLE public.actualites ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.actualites ADD COLUMN IF NOT EXISTS slug TEXT;

-- Storage bucket actualites
INSERT INTO storage.buckets (id, name, public) VALUES ('actualites', 'actualites', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage
CREATE POLICY "Lecture publique images actualites" ON storage.objects
  FOR SELECT USING (bucket_id = 'actualites');

CREATE POLICY "Admin upload images actualites" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'actualites' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "Admin delete images actualites" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'actualites' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );
