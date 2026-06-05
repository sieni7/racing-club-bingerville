import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  date: Date;
  opponent: string;
  location: 'HOME' | 'AWAY';
  score?: {
    home: number;
    away: number;
  };
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
  saison?: string;
}

const MatchSchema: Schema = new Schema({
  date: { type: Date, required: true, index: true },
  opponent: { type: String, required: true },
  location: { type: String, enum: ['HOME', 'AWAY'], required: true },
  score: {
    home: { type: Number, min: 0 },
    away: { type: Number, min: 0 }
  },
  status: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'], default: 'SCHEDULED' },
  saison: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IMatch>('Match', MatchSchema);
