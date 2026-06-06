-- =====================================================
-- RLS POLICIES - TABLE JOUEURS
-- =====================================================

-- Activer RLS
ALTER TABLE public.joueurs ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde peut voir les joueurs)
CREATE POLICY "Joueurs visibles par tous" ON public.joueurs
  FOR SELECT USING (true);

-- Écriture réservée aux ADMIN et STAFF
CREATE POLICY "Admin et staff peuvent tout modifier" ON public.joueurs
  FOR ALL USING (auth.role() IN ('ADMIN', 'STAFF'));

-- =====================================================
-- STORAGE BUCKET pour photos joueurs
-- =====================================================

-- Créer le bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('joueurs-photos', 'joueurs-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques du bucket
CREATE POLICY "Images publiques en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'joueurs-photos');

CREATE POLICY "Admin et staff peuvent uploader" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'joueurs-photos' 
    AND auth.role() IN ('ADMIN', 'STAFF')
  );

CREATE POLICY "Admin et staff peuvent supprimer" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'joueurs-photos' 
    AND auth.role() IN ('ADMIN', 'STAFF')
  );

-- =====================================================
-- RLS POLICIES - TABLE MATCHS
-- =====================================================

-- Activer RLS
ALTER TABLE public.matchs ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde peut voir les matchs)
CREATE POLICY "Matchs visibles par tous" ON public.matchs
  FOR SELECT USING (true);

-- Écriture réservée aux ADMIN et STAFF
CREATE POLICY "Admin et staff peuvent tout modifier" ON public.matchs
  FOR ALL USING (auth.role() IN ('ADMIN', 'STAFF'));
