import { NextFunction, Request, Response } from 'express';
import { NodeEnv, Status, Success } from '../types/Global';
import { NODE_ENV } from '../config';
import HttpError from 'http-errors';

export const serverIsRun = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/api') {
    return res.status(Status.OK).json({
      success: Success.OK,
      message: 'Server is sun'
    });
  }
  return next();
};

export const errorNotFound = (req: Request, _res: Response, next: NextFunction) => {
  return req.originalUrl.startsWith('/api') ? next(HttpError(Status.NOT_FOUND, 'Api not found')) : next();
};

export const errorHandler = (e: any, _req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = e.message;
  res.locals.error = NODE_ENV === NodeEnv.DEVELOPMENT ? e : '';
  let message = e?.message;
  let status = e?.status || Status.INTERNAL_SERVER_ERROR;

  if (e?.name?.includes('Sequelize') || e?.name?.includes('Validation')) {
    if (e?.parent?.constraint) {
      message = e.parent.constraint || 'Validation error';
    }

    status = Status.BAD_REQUEST;
  }

  if (!e?.message) {
    message = e;
  }

  console.error('errorHandler ->', e);

  return res.status(status).json({
    success: Success.FAIL,
    message,
    data: e?.data || undefined,
    errors: e?.errors || undefined,
    stack: NODE_ENV === NodeEnv.DEVELOPMENT ? e?.stack : undefined
  });
};

export const genericErrorHandler = (e: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('genericErrorHandler ->', e);

  return res.status(Status.INTERNAL_SERVER_ERROR).json({
    success: Success.ERROR,
    message: NODE_ENV === NodeEnv.DEVELOPMENT ? e.message : 'Something went wrong',
    stack: NODE_ENV === NodeEnv.DEVELOPMENT ? e.stack : undefined
  });
};
