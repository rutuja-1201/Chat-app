import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  console.error('Error:', err);

  const statusCode = err.message.includes('API key') ? 500 : 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
  });
}

