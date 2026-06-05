import mongoose, { Schema, Document } from 'mongoose';

export interface IJoueur extends Document {
  firstName: string;
  lastName: string;
  position: string;
  number?: number;
  birthDate?: Date;
  teamId?: string;
  userId?: mongoose.Types.ObjectId;
  status: 'ACTIF' | 'BLESSE' | 'SUSPENDU' | 'INACTIF';
}

const JoueurSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  number: { type: Number },
  birthDate: { type: Date },
  teamId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  status: { type: String, enum: ['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF'], default: 'ACTIF' }
}, {
  timestamps: true
});

export default mongoose.model<IJoueur>('Joueur', JoueurSchema);
