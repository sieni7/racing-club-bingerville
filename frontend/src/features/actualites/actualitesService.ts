import { supabase } from '../../lib/supabase';

export type StatutActualite = 'BROUILLON' | 'PUBLIE';

export interface Actualite {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  image_url: string | null;
  auteur_id: string | null;
  statut: StatutActualite;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const actualitesService = {
  async getAll(onlyPublished = false): Promise<Actualite[]> {
    let query = supabase
      .from('actualites')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    
    if (onlyPublished) {
      query = query.eq('statut', 'PUBLIE');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getLatest(limit = 3): Promise<Actualite[]> {
    const { data, error } = await supabase
      .from('actualites')
      .select('*')
      .eq('statut', 'PUBLIE')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string): Promise<Actualite> {
    const { data, error } = await supabase
      .from('actualites')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async create(actualite: Partial<Actualite>): Promise<Actualite> {
    // Generate slug from title if not provided
    if (!actualite.slug && actualite.titre) {
      actualite.slug = actualite.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { data, error } = await supabase
      .from('actualites')
      .insert(actualite)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, actualite: Partial<Actualite>): Promise<Actualite> {
    const { data, error } = await supabase
      .from('actualites')
      .update(actualite)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('actualites').delete().eq('id', id);
    if (error) throw error;
  }
};
