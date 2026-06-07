-- Table des rôles disponibles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT,
  level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les rôles par défaut
INSERT INTO public.roles (name, display_name, icon, level) VALUES
  ('SUPER_ADMIN', '👑 SUPER_ADMIN', 'crown', 100),
  ('ADMIN', 'ADMIN', 'shield', 80),
  ('STAFF', 'STAFF', 'users', 60),
  ('MEMBER', 'MEMBER', 'user', 40),
  ('JOUEUR', 'JOUEUR', 'soccer', 30),
  ('PARENT', 'PARENT', 'heart', 20)
ON CONFLICT (name) DO NOTHING;

-- Activer RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut lire les rôles
CREATE POLICY "Roles visibles par tous" ON public.roles
  FOR SELECT USING (true);
