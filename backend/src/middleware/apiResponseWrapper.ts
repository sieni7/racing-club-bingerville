import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: unknown;
  message?: string;
}

// Dual-purpose helper:
// - When used as `app.use(apiResponseWrapper)` it wraps res.json globally.
// - When used as `apiResponseWrapper(handler)` it returns a route handler wrapper that catches errors and formats responses.
export const apiResponseWrapper = (handler?: (req: Request, res: Response) => Promise<any>) => {
  if (handler && typeof handler === 'function') {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handler(req, res);
        if (!res.headersSent) {
          res.json(result);
        }
      } catch (error) {
        next(error);
      }
    };
  }

  // Global middleware mode
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      if (res.locals.skipWrapper || (body && typeof body === 'object' && 'success' in body)) {
        return originalJson.call(this, body);
      }

      const response: ApiResponse<unknown> = {
        success: res.statusCode >= 200 && res.statusCode < 300,
        data: res.statusCode >= 200 && res.statusCode < 300 ? body : undefined,
        error: res.statusCode >= 400 ? (body?.message ?? body) : undefined,
      };

      return originalJson.call(this, response);
    } as typeof res.json;

    next();
  };
};

export default apiResponseWrapper;
