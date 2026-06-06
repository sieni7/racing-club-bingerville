-- =====================================================
-- 1. TABLE PROFILS (extension de auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'STAFF', 'MEMBER', 'JOUEUR', 'PARENT')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABLE JOUEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.joueurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  nationalite TEXT,
  poste TEXT CHECK (poste IN ('GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT')),
  numero INTEGER UNIQUE,
  taille DECIMAL(5,2),
  poids DECIMAL(5,2),
  photo_url TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_joueurs_updated_at BEFORE UPDATE ON public.joueurs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour performances
CREATE INDEX idx_joueurs_numero ON public.joueurs(numero);
CREATE INDEX idx_joueurs_poste ON public.joueurs(poste);
CREATE INDEX idx_joueurs_statut ON public.joueurs(statut);

-- =====================================================
-- 3. TABLE MATCHS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.matchs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_heure TIMESTAMPTZ NOT NULL,
  adversaire TEXT NOT NULL,
  lieu TEXT NOT NULL CHECK (lieu IN ('DOMICILE', 'EXTERIEUR', 'NEUTRE')),
  competition TEXT NOT NULL CHECK (competition IN ('CHAMPIONNAT', 'COUPE', 'AMICAL')),
  score_equipe INTEGER,
  score_adversaire INTEGER,
  statut TEXT NOT NULL DEFAULT 'A_VENIR' CHECK (statut IN ('A_VENIR', 'EN_COURS', 'TERMINE', 'ANNULE')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_matchs_updated_at BEFORE UPDATE ON public.matchs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour performances
CREATE INDEX idx_matchs_date_heure ON public.matchs(date_heure);
CREATE INDEX idx_matchs_statut ON public.matchs(statut);
CREATE INDEX idx_matchs_competition ON public.matchs(competition);

-- =====================================================
-- 4. TABLE COMPOSITIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matchs(id) ON DELETE CASCADE,
  joueur_id UUID NOT NULL REFERENCES public.joueurs(id) ON DELETE CASCADE,
  statut TEXT NOT NULL CHECK (statut IN ('TITULAIRE', 'REMPLACANT', 'ABSENT')),
  numero_maillot INTEGER,
  est_capitaine BOOLEAN DEFAULT FALSE,
  minutes_jouees INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, joueur_id)
);

-- Trigger pour updated_at
CREATE TRIGGER update_compositions_updated_at BEFORE UPDATE ON public.compositions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour performances
CREATE INDEX idx_compositions_match ON public.compositions(match_id);
CREATE INDEX idx_compositions_joueur ON public.compositions(joueur_id);

-- =====================================================
-- 5. TABLE EVENEMENTS_MATCH
-- =====================================================
CREATE TABLE IF NOT EXISTS public.evenements_match (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matchs(id) ON DELETE CASCADE,
  joueur_id UUID REFERENCES public.joueurs(id) ON DELETE SET NULL,
  type_evenement TEXT NOT NULL CHECK (type_evenement IN ('BUT', 'PASSE', 'CARTON_JAUNE', 'CARTON_ROUGE', 'ENTREE', 'SORTIE')),
  minute INTEGER NOT NULL CHECK (minute BETWEEN 0 AND 120),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_evenements_match ON public.evenements_match(match_id);
CREATE INDEX idx_evenements_joueur ON public.evenements_match(joueur_id);
CREATE INDEX idx_evenements_minute ON public.evenements_match(minute);

-- =====================================================
-- 6. TABLE ACTUALITES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  auteur_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  statut TEXT NOT NULL DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON', 'PUBLIE')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_actualites_updated_at BEFORE UPDATE ON public.actualites
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour performances
CREATE INDEX idx_actualites_slug ON public.actualites(slug);
CREATE INDEX idx_actualites_statut ON public.actualites(statut);
CREATE INDEX idx_actualites_published_at ON public.actualites(published_at DESC);
