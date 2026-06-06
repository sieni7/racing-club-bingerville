-- =====================================================
-- Sprint Correctif 3 - Materialized Statistics
-- =====================================================

-- 1. Supprimer l'ancienne vue standard
DROP VIEW IF EXISTS public.stats_joueurs CASCADE;

-- 2. Créer la vue matérialisée
CREATE MATERIALIZED VIEW public.stats_joueurs AS
SELECT 
  j.id AS joueur_id,
  j.nom,
  j.prenom,
  j.numero,
  j.poste,
  j.photo_url,
  COUNT(DISTINCT c.match_id) AS matchs_joues,
  COALESCE(SUM(c.minutes_jouees), 0) AS minutes_jouees,
  COUNT(CASE WHEN e.type_evenement = 'BUT' THEN 1 END) AS buts,
  COUNT(CASE WHEN e.type_evenement = 'PASSE' THEN 1 END) AS passes_decisives,
  COUNT(CASE WHEN e.type_evenement = 'CARTON_JAUNE' THEN 1 END) AS cartons_jaunes,
  COUNT(CASE WHEN e.type_evenement = 'CARTON_ROUGE' THEN 1 END) AS cartons_rouges
FROM public.joueurs j
LEFT JOIN public.compositions c ON j.id = c.joueur_id
LEFT JOIN public.evenements_match e ON j.id = e.joueur_id
GROUP BY j.id, j.nom, j.prenom, j.numero, j.poste, j.photo_url;

-- 3. Créer les index sur la vue matérialisée
CREATE UNIQUE INDEX idx_stats_joueurs_id ON public.stats_joueurs (joueur_id);
CREATE INDEX idx_stats_joueurs_buts ON public.stats_joueurs (buts DESC);
CREATE INDEX idx_stats_joueurs_passes ON public.stats_joueurs (passes_decisives DESC);

-- 4. Fonction de refresh
CREATE OR REPLACE FUNCTION public.refresh_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.stats_joueurs;
  RETURN NULL;
END;
$$;

-- 5. Triggers pour refresh automatique
-- Après ajout/modification/suppression d'événement
CREATE TRIGGER refresh_stats_on_event
  AFTER INSERT OR UPDATE OR DELETE ON public.evenements_match
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.refresh_stats();

-- Après modification de composition
CREATE TRIGGER refresh_stats_on_composition
  AFTER INSERT OR UPDATE OR DELETE ON public.compositions
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.refresh_stats();

-- 6. Vues de classement (inchangées, mais lisent maintenant la MV)
CREATE OR REPLACE VIEW public.top_buteurs AS
SELECT * FROM public.stats_joueurs
WHERE buts > 0
ORDER BY buts DESC, matchs_joues ASC
LIMIT 10;

CREATE OR REPLACE VIEW public.top_passeurs AS
SELECT * FROM public.stats_joueurs
WHERE passes_decisives > 0
ORDER BY passes_decisives DESC, matchs_joues ASC
LIMIT 10;
