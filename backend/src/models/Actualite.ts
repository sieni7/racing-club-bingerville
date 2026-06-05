import mongoose, { Schema, Document } from 'mongoose';

export interface IActualite extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  published: boolean;
  publishedAt?: Date;
}

const ActualiteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IActualite>('Actualite', ActualiteSchema);
