import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Minimal placeholder: mark request as authenticated if needed.
  // Attach a fake user object if downstream code expects it.
  // Example: req.user = { id: 'anonymous', roles: [] } as any;
  return next();
};

export default authMiddleware;
