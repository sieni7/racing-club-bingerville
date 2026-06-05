import { BaseRepository } from './BaseRepository';
import RefreshToken, { IRefreshToken } from '../models/RefreshToken';

export class RefreshTokenRepository extends BaseRepository<IRefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async findByTokenHash(tokenHash: string): Promise<IRefreshToken | null> {
    return this.findOne({ tokenHash, isRevoked: false });
  }

  async findTokenByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return this.findOne({ tokenHash });
  }

  async revoke(tokenHash: string): Promise<boolean> {
    const updated = await this.model.findOneAndUpdate(
      { tokenHash },
      { isRevoked: true }
    ).exec();
    return updated !== null;
  }

  async revokeFamily(familyId: string): Promise<void> {
    await this.model.updateMany(
      { familyId },
      { isRevoked: true }
    ).exec();
  }

  async markFamilyCompromised(familyId: string): Promise<void> {
    await this.model.updateMany(
      { familyId },
      { isRevoked: true, compromised: true }
    ).exec();
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
