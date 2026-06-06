import { supabase } from '../../lib/supabase';

export type Lieu = 'DOMICILE' | 'EXTERIEUR' | 'NEUTRE';
export type Competition = 'CHAMPIONNAT' | 'COUPE' | 'AMICAL';
export type StatutMatch = 'A_VENIR' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface Match {
  id: string;
  date_heure: string;
  adversaire: string;
  lieu: Lieu;
  competition: Competition;
  score_equipe: number | null;
  score_adversaire: number | null;
  statut: StatutMatch;
  created_at: string;
  updated_at: string;
}

export const matchsService = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matchs')
      .select('*')
      .order('date_heure', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Match> {
    const { data, error } = await supabase
      .from('matchs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    const { data, error } = await supabase
      .from('matchs')
      .insert(match)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, match: Partial<Match>): Promise<Match> {
    const { data, error } = await supabase
      .from('matchs')
      .update(match)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('matchs').delete().eq('id', id);
    if (error) throw error;
  }
};
