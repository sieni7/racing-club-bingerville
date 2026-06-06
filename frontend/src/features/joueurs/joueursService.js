import { supabase } from '../../lib/supabase';
export const joueursService = {
    async getAll() {
        const { data, error } = await supabase
            .from('joueurs')
            .select('*')
            .order('numero', { ascending: true });
        if (error)
            throw error;
        return data;
    },
    async getById(id) {
        const { data, error } = await supabase
            .from('joueurs')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    },
    async create(joueur) {
        const { data, error } = await supabase
            .from('joueurs')
            .insert(joueur)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async update(id, joueur) {
        const { data, error } = await supabase
            .from('joueurs')
            .update(joueur)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async delete(id) {
        const { error } = await supabase.from('joueurs').delete().eq('id', id);
        if (error)
            throw error;
    },
    async uploadPhoto(file, joueurId) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${joueurId}-${Date.now()}.${fileExt}`;
        const filePath = `joueurs/${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('joueurs-photos')
            .upload(filePath, file);
        if (uploadError)
            throw uploadError;
        const { data: { publicUrl } } = supabase.storage
            .from('joueurs-photos')
            .getPublicUrl(filePath);
        return publicUrl;
    },
    async deletePhoto(photoUrl) {
        const filePath = photoUrl.split('/').pop();
        if (!filePath)
            return;
        await supabase.storage.from('joueurs-photos').remove([`joueurs/${filePath}`]);
    }
};
