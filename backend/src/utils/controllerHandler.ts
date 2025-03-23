import { Request, Response, NextFunction } from 'express';

type ControllerFunction<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export const controllerHandler = <T>(
  controllerFn: ControllerFunction<T>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};