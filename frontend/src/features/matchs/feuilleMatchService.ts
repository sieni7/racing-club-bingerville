import { supabase } from '../../lib/supabase';

export type StatutComposition = 'TITULAIRE' | 'REMPLACANT' | 'ABSENT';
export type TypeEvenement = 'BUT' | 'PASSE' | 'CARTON_JAUNE' | 'CARTON_ROUGE' | 'ENTREE' | 'SORTIE';

export interface Composition {
  id: string;
  match_id: string;
  joueur_id: string;
  statut: StatutComposition;
  numero_maillot: number | null;
  est_capitaine: boolean;
  minutes_jouees: number;
  // joined fields
  joueurs?: {
    id: string;
    nom: string;
    prenom: string;
    poste: string;
    numero: number;
  };
}

export interface EvenementMatch {
  id: string;
  match_id: string;
  joueur_id: string | null;
  type_evenement: TypeEvenement;
  minute: number;
  description: string | null;
  // joined fields
  joueurs?: {
    nom: string;
    prenom: string;
  } | null;
}

export const feuilleMatchService = {
  // Compositions
  async getCompositionByMatch(matchId: string): Promise<Composition[]> {
    const { data, error } = await supabase
      .from('compositions')
      .select(`
        *,
        joueurs:joueur_id (id, nom, prenom, poste, numero)
      `)
      .eq('match_id', matchId);
    if (error) throw error;
    return data;
  },

  async upsertComposition(compositions: Partial<Composition>[]): Promise<void> {
    const { error } = await supabase
      .from('compositions')
      .upsert(compositions, { onConflict: 'match_id, joueur_id' });
    if (error) throw error;
  },

  // Evenements
  async getEvenementsByMatch(matchId: string): Promise<EvenementMatch[]> {
    const { data, error } = await supabase
      .from('evenements_match')
      .select(`
        *,
        joueurs:joueur_id (nom, prenom)
      `)
      .eq('match_id', matchId)
      .order('minute', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createEvenement(evenement: Omit<EvenementMatch, 'id' | 'created_at'>): Promise<EvenementMatch> {
    const { data, error } = await supabase
      .from('evenements_match')
      .insert(evenement)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteEvenement(id: string): Promise<void> {
    const { error } = await supabase.from('evenements_match').delete().eq('id', id);
    if (error) throw error;
  }
};

