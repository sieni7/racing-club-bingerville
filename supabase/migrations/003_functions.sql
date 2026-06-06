-- 003_functions.sql
-- Placeholder for stored procedures or functions (e.g., refresh materialized views)

CREATE OR REPLACE FUNCTION public.refresh_stats_joueurs()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.stats_joueurs;
END;
$$;
