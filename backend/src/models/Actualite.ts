import mongoose, { Document, Schema } from 'mongoose';

export interface IActualite extends Document {
  titre: string;
  contenu: string;
  datePublication: Date;
  auteurId: mongoose.Types.ObjectId;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const actualiteSchema = new Schema<IActualite>({
  titre: { type: String, required: true, trim: true },
  contenu: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  auteurId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  tags: [{ type: String, trim: true }]
}, {
  timestamps: true
});

actualiteSchema.index({ datePublication: -1 }); // Pour tri par ordre chronologique
actualiteSchema.index({ tags: 1 });

export const Actualite = mongoose.model<IActualite>('Actualite', actualiteSchema);
