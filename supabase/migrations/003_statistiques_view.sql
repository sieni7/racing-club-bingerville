-- =====================================================
-- VUE STATISTIQUES JOUEURS
-- =====================================================
CREATE OR REPLACE VIEW public.stats_joueurs AS
SELECT 
  j.id AS joueur_id,
  j.nom,
  j.prenom,
  j.numero,
  j.poste,
  j.photo_url,
  -- Matchs joués (compositions avec statut TITULAIRE ou REMPLACANT)
  COUNT(DISTINCT c.match_id) AS matchs_joues,
  -- Minutes jouées
  COALESCE(SUM(c.minutes_jouees), 0) AS minutes_jouees,
  -- Buts
  COUNT(CASE WHEN e.type_evenement = 'BUT' THEN 1 END) AS buts,
  -- Passes décisives
  COUNT(CASE WHEN e.type_evenement = 'PASSE' THEN 1 END) AS passes_decisives,
  -- Cartons jaunes
  COUNT(CASE WHEN e.type_evenement = 'CARTON_JAUNE' THEN 1 END) AS cartons_jaunes,
  -- Cartons rouges
  COUNT(CASE WHEN e.type_evenement = 'CARTON_ROUGE' THEN 1 END) AS cartons_rouges
FROM public.joueurs j
LEFT JOIN public.compositions c ON j.id = c.joueur_id
LEFT JOIN public.evenements_match e ON j.id = e.joueur_id
GROUP BY j.id, j.nom, j.prenom, j.numero, j.poste, j.photo_url;

-- =====================================================
-- CLASSEMENT BUTEURS (Top 10)
-- =====================================================
CREATE OR REPLACE VIEW public.top_buteurs AS
SELECT * FROM public.stats_joueurs
WHERE buts > 0
ORDER BY buts DESC, matchs_joues ASC
LIMIT 10;

-- =====================================================
-- CLASSEMENT PASSEURS (Top 10)
-- =====================================================
CREATE OR REPLACE VIEW public.top_passeurs AS
SELECT * FROM public.stats_joueurs
WHERE passes_decisives > 0
ORDER BY passes_decisives DESC, matchs_joues ASC
LIMIT 10;

-- =====================================================
-- CLASSEMENT DISCIPLINE (Cartons)
-- =====================================================
CREATE OR REPLACE VIEW public.top_discipline AS
SELECT * FROM public.stats_joueurs
WHERE (cartons_jaunes + cartons_rouges) > 0
ORDER BY (cartons_jaunes + cartons_rouges) DESC
LIMIT 10;
