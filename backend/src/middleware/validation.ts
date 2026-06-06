import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if ((error as any)?.errors) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: (error as any).errors
        });
      }
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
