import { supabase } from '../../lib/supabase';
export const statistiquesService = {
    async getStatsGlobales() {
        const { data, error } = await supabase
            .from('stats_joueurs')
            .select('*');
        if (error)
            throw error;
        return data;
    },
    async getTopButeurs() {
        const { data, error } = await supabase
            .from('top_buteurs')
            .select('*');
        if (error)
            throw error;
        return data;
    },
    async getTopPasseurs() {
        const { data, error } = await supabase
            .from('top_passeurs')
            .select('*');
        if (error)
            throw error;
        return data;
    },
    async getTopDiscipline() {
        const { data, error } = await supabase
            .from('top_discipline')
            .select('*');
        if (error)
            throw error;
        return data;
    }
};
