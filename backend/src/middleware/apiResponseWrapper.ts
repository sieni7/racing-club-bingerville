import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const apiResponseWrapper = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function (body: unknown) {
    if (res.locals.skipWrapper || (body && typeof body === 'object' && 'success' in body)) {
      return originalJson.call(this, body);
    }
    
    const response: ApiResponse<unknown> = {
      success: res.statusCode >= 200 && res.statusCode < 300,
      data: res.statusCode >= 200 && res.statusCode < 300 ? body : undefined,
      error: res.statusCode >= 400 ? body?.message || body : undefined,
    };
    
    return originalJson.call(this, response);
  };
  
  next();
};
