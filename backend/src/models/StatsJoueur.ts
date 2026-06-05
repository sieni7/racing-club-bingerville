import mongoose, { Document, Schema } from 'mongoose';

export interface IStatsJoueur extends Document {
  joueurId: mongoose.Types.ObjectId;
  saison: string;
  matchsJoues: number;
  buts: number;
  passes: number;
  cartonsJaunes: number;
  cartonsRouges: number;
  createdAt: Date;
  updatedAt: Date;
}

const statsJoueurSchema = new Schema<IStatsJoueur>({
  joueurId: { type: Schema.Types.ObjectId, ref: 'Joueur', required: true },
  saison: { type: String, required: true },
  matchsJoues: { type: Number, default: 0 },
  buts: { type: Number, default: 0 },
  passes: { type: Number, default: 0 },
  cartonsJaunes: { type: Number, default: 0 },
  cartonsRouges: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index composé unique pour s'assurer qu'un joueur a max 1 stat par saison
statsJoueurSchema.index({ joueurId: 1, saison: 1 }, { unique: true });
statsJoueurSchema.index({ buts: -1 }); // Pour trier les meilleurs buteurs
statsJoueurSchema.index({ passes: -1 }); // Pour trier les meilleurs passeurs

export const StatsJoueur = mongoose.model<IStatsJoueur>('StatsJoueur', statsJoueurSchema);
