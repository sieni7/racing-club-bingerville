import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  tokenHash: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  familyId?: string;
  compromised: boolean;
}

const RefreshTokenSchema: Schema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: '0' } },
  isRevoked: { type: Boolean, default: false },
  familyId: { type: String, index: true },
  compromised: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
