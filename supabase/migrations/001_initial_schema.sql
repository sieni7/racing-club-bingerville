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
