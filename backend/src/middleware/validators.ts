import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { taskSchema, taskQuerySchema, taskIdSchema } from '../types';

const handleZodError = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    return res.status(400).json({
      code: 400,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  return null;
};

export const validateTaskInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    taskSchema.parse(req.body);
    next();
  } catch (error) {
    const errorResponse = handleZodError(error, res);
    if (errorResponse) return errorResponse;
    next(error);
  }
};

export const validateTaskQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = taskQuerySchema.parse(req.query);
    req.query = query as any;
    next();
  } catch (error) {
    const errorResponse = handleZodError(error, res);
    if (errorResponse) return errorResponse;
    next(error);
  }
};

export const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  try {
    taskIdSchema.parse({ id: req.params.id });
    next();
  } catch (error) {
    const errorResponse = handleZodError(error, res);
    if (errorResponse) return errorResponse;
    next(error);
  }
};