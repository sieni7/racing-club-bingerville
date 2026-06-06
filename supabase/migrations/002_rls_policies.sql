-- 002_rls_policies.sql

-- Profiles policies
CREATE POLICY "Profils visibles par tous" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent modifier leur profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin peut tout modifier" ON public.profiles FOR ALL USING (auth.role() = 'ADMIN');

-- Joueurs policies
CREATE POLICY "Joueurs visibles par tous" ON public.joueurs FOR SELECT USING (true);
CREATE POLICY "Staff et admin peuvent modifier" ON public.joueurs FOR ALL USING (auth.role() IN ('ADMIN', 'STAFF'));

-- Matchs policies
CREATE POLICY "Matchs visibles par tous" ON public.matchs FOR SELECT USING (true);
CREATE POLICY "Staff et admin peuvent modifier" ON public.matchs FOR ALL USING (auth.role() IN ('ADMIN', 'STAFF'));

-- Actualites policies
CREATE POLICY "Actus visibles par tous" ON public.actualites FOR SELECT USING (statut = 'PUBLIE');
CREATE POLICY "Admin et staff peuvent gerer" ON public.actualites FOR ALL USING (auth.role() IN ('ADMIN', 'STAFF'));
