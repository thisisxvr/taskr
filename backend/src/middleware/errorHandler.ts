import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message
    });
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message
    }));
    
    return res.status(400).json({
      code: 400,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: err.message
    });
  }

  return res.status(500).json({
    code: 500,
    message: 'Internal Server Error'
  });
};