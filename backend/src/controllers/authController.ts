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
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const deviceFingerprint = generateDeviceFingerprint(req.ip || '0.0.0.0', req.headers['user-agent'] || '');
    
    const { accessToken, refreshToken } = await authService.login(email, password, deviceFingerprint);
    
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
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
  } catch (error: any) {
    // If refresh fails, clear the cookie
    res.clearCookie('refreshToken');
    res.status(401).json({ success: false, error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error during logout' });
  }
};

export const logoutAll = async (req: Request, res: Response) => {
  try {
    const familyId = (req as any).user?.familyId;
    if (familyId) {
      await authService.logoutAll(familyId);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error during global logout' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // req.user is set by authenticate middleware
    const user = (req as any).user;
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error retrieving profile' });
  }
};
