import { supabase } from '../../lib/supabase';
export const feuilleMatchService = {
    // Compositions
    async getCompositionByMatch(matchId) {
        const { data, error } = await supabase
            .from('compositions')
            .select(`
        *,
        joueurs:joueur_id (id, nom, prenom, poste, numero)
      `)
            .eq('match_id', matchId);
        if (error)
            throw error;
        return data;
    },
    async upsertComposition(compositions) {
        const { error } = await supabase
            .from('compositions')
            .upsert(compositions, { onConflict: 'match_id, joueur_id' });
        if (error)
            throw error;
    },
    // Evenements
    async getEvenementsByMatch(matchId) {
        const { data, error } = await supabase
            .from('evenements_match')
            .select(`
        *,
        joueurs:joueur_id (nom, prenom)
      `)
            .eq('match_id', matchId)
            .order('minute', { ascending: true });
        if (error)
            throw error;
        return data;
    },
    async createEvenement(evenement) {
        const { data, error } = await supabase
            .from('evenements_match')
            .insert(evenement)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async deleteEvenement(id) {
        const { error } = await supabase.from('evenements_match').delete().eq('id', id);
        if (error)
            throw error;
    }
};
