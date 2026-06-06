-- =====================================================
-- FIX RLS - Sprint Correctif 1
-- =====================================================

-- 1. Fonction pour récupérer le rôle de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- 2. Fonction pour vérifier un rôle spécifique
CREATE OR REPLACE FUNCTION auth.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = required_role
  )
$$;

-- 3. Trigger pour Custom JWT Claims
CREATE OR REPLACE FUNCTION public.custom_jwt_claims()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ajouter le rôle dans les métadonnées du JWT
  NEW.raw_app_meta_data = jsonb_set(
    COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
    '{user_role}',
    to_jsonb((SELECT role FROM public.profiles WHERE id = NEW.id))
  );
  RETURN NEW;
END;
$$;

-- Déclencher sur mise à jour du profil
CREATE OR REPLACE TRIGGER on_profile_updated
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.custom_jwt_claims();

-- 4. Correction des politiques RLS

-- Supprimer les anciennes politiques (tous les tables concernées)
DROP POLICY IF EXISTS "Admin et staff peuvent tout modifier" ON public.joueurs;
DROP POLICY IF EXISTS "Admin et staff peuvent tout modifier" ON public.matchs;
DROP POLICY IF EXISTS "Admin et staff peuvent gérer compositions" ON public.compositions;
DROP POLICY IF EXISTS "Admin et staff peuvent gérer événements" ON public.evenements_match;
DROP POLICY IF EXISTS "Admin et staff peuvent tout voir" ON public.actualites;
DROP POLICY IF EXISTS "Admin et staff peuvent tout modifier" ON public.actualites;

-- Nouvelles politiques avec get_user_role()
CREATE POLICY "Admin et staff peuvent tout modifier" ON public.joueurs
  FOR ALL USING (public.get_user_role() IN ('ADMIN', 'STAFF'));

CREATE POLICY "Admin et staff peuvent tout modifier" ON public.matchs
  FOR ALL USING (public.get_user_role() IN ('ADMIN', 'STAFF'));

CREATE POLICY "Admin et staff peuvent gérer compositions" ON public.compositions
  FOR ALL USING (public.get_user_role() IN ('ADMIN', 'STAFF'));

CREATE POLICY "Admin et staff peuvent gérer événements" ON public.evenements_match
  FOR ALL USING (public.get_user_role() IN ('ADMIN', 'STAFF'));

CREATE POLICY "Admin et staff peuvent tout voir" ON public.actualites
  FOR SELECT USING (public.get_user_role() IN ('ADMIN', 'STAFF'));

CREATE POLICY "Admin et staff peuvent tout modifier" ON public.actualites
  FOR ALL USING (public.get_user_role() IN ('ADMIN', 'STAFF'));
