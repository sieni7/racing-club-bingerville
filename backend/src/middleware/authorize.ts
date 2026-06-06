import { Request, Response, NextFunction } from 'express';

export const authorize = (..._roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Minimal placeholder: allow all requests for now.
    // Replace with real role checks later, e.g. req.user.role
    return next();
  };
};

export default authorize;
