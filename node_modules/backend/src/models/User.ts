import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'ADMIN' | 'COACH' | 'PLAYER';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'COACH', 'PLAYER'], default: 'PLAYER' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
