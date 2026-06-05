import { userService } from './UserService';
import { refreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../config/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class AuthService {
  async register(userData: any) {
    const existing = await userService.getUserByEmail(userData.email);
    if (existing) throw new Error('Email already in use');

    const hashedPassword = await hashPassword(userData.password);
    return userService.createUser({ ...userData, password: hashedPassword });
  }

  async login(email: string, password: string, deviceFingerprint: string) {
    const user = await userService.getUserByEmail(email);
    if (!user || !user.password) throw new Error('Invalid credentials');
    
    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const familyId = uuidv4();
    return this.generateTokensForUser(user._id.toString(), user.role || 'MEMBER', familyId);
  }

  async refresh(tokenString: string, deviceFingerprint: string) {
    const tokenHash = crypto.createHash('sha256').update(tokenString).digest('hex');
    const existingToken = await refreshTokenRepository.findTokenByHash(tokenHash);

    if (!existingToken) {
      throw new Error('Invalid token');
    }

    if (existingToken.isRevoked) {
      if (existingToken.familyId) {
        await refreshTokenRepository.markFamilyCompromised(existingToken.familyId);
      }
      throw new Error('Token compromised');
    }

    if (existingToken.expiresAt < new Date()) {
      throw new Error('Token expired');
    }

    await refreshTokenRepository.revoke(tokenHash);

    const user = await userService.getUserById(existingToken.userId.toString());
    if (!user) throw new Error('User not found');

    return this.generateTokensForUser(user._id.toString(), user.role || 'MEMBER', existingToken.familyId);
  }

  private async generateTokensForUser(userId: string, role: string, familyId?: string) {
    const payload: TokenPayload = { userId, role, familyId };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create({
      tokenHash,
      userId: userId as any,
      expiresAt,
      isRevoked: false,
      familyId,
      compromised: false
    });

    return { accessToken, refreshToken };
  }

  async logout(tokenString: string) {
    const tokenHash = crypto.createHash('sha256').update(tokenString).digest('hex');
    await refreshTokenRepository.revoke(tokenHash);
  }

  async logoutAll(familyId: string) {
    await refreshTokenRepository.revokeFamily(familyId);
  }
}

export const authService = new AuthService();
