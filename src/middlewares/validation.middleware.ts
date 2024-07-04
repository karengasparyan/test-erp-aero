import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { Status, Success } from '../types/Global';

export default function ValidationMiddleware(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, query, params, file } = req;

      schema.parse({ body, query, params, file });

      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        const errors: any = {};

        e.errors.forEach(
          (e) => (errors[typeof e.path[e.path.length - 1] === 'number' ? e.path[e.path.length - 2] : e.path[e.path.length - 1]] = e.message)
        );

        return res.status(Status.UNPROCESSABLE_ENTITY).json({
          success: Success.FAIL,
          message: 'Validation fail',
          errors
        });
      }
      return next(e);
    }
  };
}
