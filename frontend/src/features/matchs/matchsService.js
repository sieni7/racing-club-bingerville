import { supabase } from '../../lib/supabase';
export const matchsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('matchs')
            .select('*')
            .order('date_heure', { ascending: true });
        if (error)
            throw error;
        return data;
    },
    async getById(id) {
        const { data, error } = await supabase
            .from('matchs')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    },
    async create(match) {
        const { data, error } = await supabase
            .from('matchs')
            .insert(match)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async update(id, match) {
        const { data, error } = await supabase
            .from('matchs')
            .update(match)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async delete(id) {
        const { error } = await supabase.from('matchs').delete().eq('id', id);
        if (error)
            throw error;
    }
};
