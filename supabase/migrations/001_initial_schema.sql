-- 001_initial_schema.sql (see project spec)

-- Profiles (extension of auth.users)
CREATE TABLE public.profiles (
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

-- Joueurs
CREATE TABLE public.joueurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  numero INTEGER UNIQUE,
  poste TEXT CHECK (poste IN ('G', 'D', 'DC', 'LAT', 'M', 'MOC', 'A', 'BU')),
  date_naissance DATE,
  nationalite TEXT,
  taille DECIMAL(5,2),
  poids DECIMAL(5,2),
  photo_url TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matchs
CREATE TABLE public.matchs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMPTZ NOT NULL,
  heure TIME NOT NULL,
  adversaire TEXT NOT NULL,
  lieu TEXT NOT NULL,
  competition TEXT,
  statut TEXT DEFAULT 'PLANIFIE' CHECK (statut IN ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE')),
  score_domicile INTEGER DEFAULT 0,
  score_exterieur INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compositions
CREATE TABLE public.compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matchs(id) ON DELETE CASCADE,
  joueur_id UUID REFERENCES public.joueurs(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('TITULAIRE', 'REMPLACANT')),
  numero_maillot INTEGER,
  est_capitaine BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, joueur_id)
);

-- Evenements
CREATE TABLE public.evenements_match (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matchs(id) ON DELETE CASCADE,
  joueur_id UUID REFERENCES public.joueurs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('BUT', 'PASSE_DECISIVE', 'CARTON_JAUNE', 'CARTON_ROUGE', 'REMPLACEMENT')),
  minute INTEGER NOT NULL CHECK (minute BETWEEN 0 AND 120),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actualites
CREATE TABLE public.actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  resume TEXT,
  contenu TEXT NOT NULL,
  image_url TEXT,
  auteur_id UUID REFERENCES public.profiles(id),
  statut TEXT DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON', 'PUBLIE')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
