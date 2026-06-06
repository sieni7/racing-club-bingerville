import { Request, Response, NextFunction } from 'express';
import authorizeDefault from './authorize';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Temporary authentication for build/dev: attach a fake admin user.
  // Replace with real logic later.
  (req as any).user = { id: 'test', role: 'ADMIN' };
  next();
};

// Re-export authorize from the separate module so imports remain stable
export const authorize = authorizeDefault;

export default authenticate;
