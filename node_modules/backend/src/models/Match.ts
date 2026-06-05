import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICompositionJoueur {
  joueurId: Types.ObjectId;
  role: 'TITULAIRE' | 'REMPLACANT';
  numero: number;
  poste: 'G' | 'D' | 'DC' | 'M' | 'A' | 'BU';
}

export interface IEvenementMatch {
  type: 'BUT' | 'CARTON_JAUNE' | 'CARTON_ROUGE' | 'PASSE';
  joueurId: Types.ObjectId;
  minute: number;
  details?: string;
}

export interface IMatch extends Document {
  date: Date;
  adversaire: string;
  lieu: 'DOMICILE' | 'EXTERIEUR';
  scoreRacing: number;
  scoreAdversaire: number;
  composition: ICompositionJoueur[];
  evenements: IEvenementMatch[];
  statut: 'PROGRAMME' | 'EN_COURS' | 'TERMINE' | 'REPORTE';
  saison: string;
}

const CompositionSchema = new Schema<ICompositionJoueur>({
  joueurId: { type: Schema.Types.ObjectId, ref: 'Joueur', required: true },
  role: { type: String, enum: ['TITULAIRE', 'REMPLACANT'], required: true },
  numero: { type: Number, required: true, min: 1, max: 99 },
  poste: { type: String, enum: ['G', 'D', 'DC', 'M', 'A', 'BU'], required: true }
}, { _id: false });

const EvenementSchema = new Schema<IEvenementMatch>({
  type: { type: String, enum: ['BUT', 'CARTON_JAUNE', 'CARTON_ROUGE', 'PASSE'], required: true },
  joueurId: { type: Schema.Types.ObjectId, ref: 'Joueur', required: true },
  minute: { type: Number, required: true, min: 0, max: 120 },
  details: { type: String }
}, { _id: true }); // keep _id to easily delete/update specific events

const MatchSchema = new Schema<IMatch>({
  date: { type: Date, required: true, index: true },
  adversaire: { type: String, required: true },
  lieu: { type: String, enum: ['DOMICILE', 'EXTERIEUR'], required: true },
  scoreRacing: { type: Number, min: 0, default: 0 },
  scoreAdversaire: { type: Number, min: 0, default: 0 },
  composition: { type: [CompositionSchema], default: [] },
  evenements: { type: [EvenementSchema], default: [] },
  statut: { type: String, enum: ['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE'], default: 'PROGRAMME' },
  saison: { type: String, required: true, match: /^\d{4}-\d{4}$/ }
}, {
  timestamps: true
});

export default mongoose.model<IMatch>('Match', MatchSchema);
