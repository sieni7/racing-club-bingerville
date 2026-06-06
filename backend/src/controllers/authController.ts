import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { generateDeviceFingerprint } from '../utils/deviceFingerprint';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: { id: user._id, email: user.email } });
  } catch (error: unknown) {
    res.status(400).json({ success: false, error: (error as any).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const deviceFingerprint = generateDeviceFingerprint(req.ip || '0.0.0.0', req.headers['user-agent'] || '');
    
    const { accessToken, refreshToken } = await authService.login(email, password, deviceFingerprint);
    
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error: unknown) {
    res.status(401).json({ message: (error as any).message || 'Invalid refresh token' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshTokenString = req.cookies?.refreshToken;
    if (!refreshTokenString) {
      return res.status(401).json({ success: false, error: 'No refresh token provided' });
    }

    const deviceFingerprint = generateDeviceFingerprint(req.ip || '0.0.0.0', req.headers['user-agent'] || '');
    const { accessToken, refreshToken } = await authService.refresh(refreshTokenString, deviceFingerprint);
    
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error: unknown) {
    if ((error as any)?.errors) {
      return res.status(400).json({ message: 'Validation error', errors: (error as any).errors });
    }
    res.status(400).json({ message: (error as any).message || 'Error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshTokenString = req.cookies?.refreshToken;
    if (refreshTokenString) {
      await authService.logout(refreshTokenString);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error logging out' });
  }
};

export const logoutAll = async (req: Request, res: Response) => {
  try {
    // Cast req object properly for custom Auth Request
    const familyId = (req as Request & { user?: { familyId: string } }).user?.familyId;
    if (!familyId) {
      return res.status(401).json({ message: 'Not authenticated properly' });
    }
    await authService.logoutAll(familyId);
    
    res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error logging out from all devices' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: object }).user;
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error retrieving user info' });
  }
};
