import { supabase } from '../../lib/supabase';

export interface StatJoueur {
  joueur_id: string;
  nom: string;
  prenom: string;
  numero: number;
  poste: string;
  photo_url: string | null;
  matchs_joues: number;
  minutes_jouees: number;
  buts: number;
  passes_decisives: number;
  cartons_jaunes: number;
  cartons_rouges: number;
}

export const statistiquesService = {
  async getStatsGlobales(): Promise<StatJoueur[]> {
    const { data, error } = await supabase
      .from('stats_joueurs')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getTopButeurs(): Promise<StatJoueur[]> {
    const { data, error } = await supabase
      .from('top_buteurs')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getTopPasseurs(): Promise<StatJoueur[]> {
    const { data, error } = await supabase
      .from('top_passeurs')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getTopDiscipline(): Promise<StatJoueur[]> {
    const { data, error } = await supabase
      .from('top_discipline')
      .select('*');
    if (error) throw error;
    return data;
  }
};
