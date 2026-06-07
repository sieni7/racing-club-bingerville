-- =====================================================
-- FIX RLS - Vérification et ajout des politiques manquantes
-- =====================================================

-- 1. Vérifier RLS sur site_sections
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si existantes
DROP POLICY IF EXISTS "Lecture publique site_sections" ON public.site_sections;
DROP POLICY IF EXISTS "Admin write site_sections" ON public.site_sections;

-- Recréer les politiques
CREATE POLICY "Lecture publique site_sections" ON public.site_sections
  FOR SELECT USING (true);

CREATE POLICY "Admin write site_sections" ON public.site_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- 2. Vérifier RLS sur actualites
ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique actualités" ON public.actualites;
DROP POLICY IF EXISTS "Admin full access actualites" ON public.actualites;

CREATE POLICY "Lecture publique actualités" ON public.actualites
  FOR SELECT USING (statut = 'PUBLIE');

CREATE POLICY "Admin full access actualites" ON public.actualites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- 3. Vérifier RLS sur evenements_match
ALTER TABLE public.evenements_match ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Evenements visibles par tous" ON public.evenements_match;
DROP POLICY IF EXISTS "Admin staff peuvent gérer événements" ON public.evenements_match;

CREATE POLICY "Evenements visibles par tous" ON public.evenements_match
  FOR SELECT USING (true);

CREATE POLICY "Admin staff peuvent gérer événements" ON public.evenements_match
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
  );

-- 4. Vérifier RLS sur compositions
ALTER TABLE public.compositions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Compositions visibles par tous" ON public.compositions;
DROP POLICY IF EXISTS "Admin staff peuvent gérer compositions" ON public.compositions;

CREATE POLICY "Compositions visibles par tous" ON public.compositions
  FOR SELECT USING (true);

CREATE POLICY "Admin staff peuvent gérer compositions" ON public.compositions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
  );
