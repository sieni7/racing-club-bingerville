import { supabase } from '../../lib/supabase';

export interface Joueur {
  id: string;
  user_id?: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  nationalite: string;
  poste: 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT';
  numero: number;
  taille: number;
  poids: number;
  photo_url: string | null;
  statut: 'ACTIF' | 'BLESSE' | 'SUSPENDU' | 'INACTIF';
  created_at: string;
  updated_at: string;
}

export const joueursService = {
  async getAll(): Promise<Joueur[]> {
    const { data, error } = await supabase
      .from('joueurs')
      .select('*')
      .order('numero', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Joueur> {
    const { data, error } = await supabase
      .from('joueurs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(joueur: Omit<Joueur, 'id' | 'created_at' | 'updated_at'>): Promise<Joueur> {
    const { data, error } = await supabase
      .from('joueurs')
      .insert(joueur)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, joueur: Partial<Joueur>): Promise<Joueur> {
    const { data, error } = await supabase
      .from('joueurs')
      .update(joueur)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('joueurs').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadPhoto(file: File, joueurId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${joueurId}-${Date.now()}.${fileExt}`;
    const filePath = `joueurs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('joueurs-photos')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('joueurs-photos')
      .getPublicUrl(filePath);
    return publicUrl;
  },

  async deletePhoto(photoUrl: string): Promise<void> {
    const filePath = photoUrl.split('/').pop();
    if (!filePath) return;
    await supabase.storage.from('joueurs-photos').remove([`joueurs/${filePath}`]);
  }
};
