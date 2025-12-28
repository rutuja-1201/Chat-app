import { Request, Response, NextFunction } from 'express';

export function validateMessageLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { message } = req.body;
  if (message && message.length > 5000) {
    return res.status(400).json({
      error: 'Message too long. Maximum length is 5000 characters.',
    });
  }
  next();
}

