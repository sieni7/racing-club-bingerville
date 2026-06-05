import mongoose, { Schema, Document } from 'mongoose';

export interface IJoueur extends Document {
  userId?: mongoose.Types.ObjectId;
  numeroLicence: string;
  nom: string;
  prenom: string;
  poste: string;
  dateNaissance: Date;
  taille?: number;
  poids?: number;
  statut: 'ACTIF' | 'BLESSE' | 'SUSPENDU' | 'INACTIF';
}

const JoueurSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, unique: true, sparse: true },
  numeroLicence: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  poste: { type: String, required: true, index: true },
  dateNaissance: { type: Date, required: true },
  taille: { type: Number },
  poids: { type: Number },
  statut: { type: String, enum: ['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF'], default: 'ACTIF', index: true }
}, {
  timestamps: true
});

export default mongoose.model<IJoueur>('Joueur', JoueurSchema);
