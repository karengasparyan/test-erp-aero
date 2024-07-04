import { NextFunction, Request, Response } from 'express';
import { Status, Success } from '../types/Global';
import * as users from '../services/Users';
import { ChangePasswordType, UpdateInfoType } from '../schemas/users.schema';
import { FiltersType } from '../schemas/global.schema';

export default class UsersController {
  static Me = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user } = req;

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'User data',
        data: user
      });
    } catch (e) {
      return next(e);
    }
  };

  static UpdateInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const payload = req.body as UpdateInfoType;

      const data = await users.updateInfo(user_id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Update successfully',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Destroy = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      await users.destroy(user_id);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'User successfully destroy'
      });
    } catch (e) {
      return next(e);
    }
  };

  static ChangePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const payload = req.body as ChangePasswordType;

      await users.changePassword(user_id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Password change successfully'
      });
    } catch (e) {
      return next(e);
    }
  };

  static LoginHistories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const payload = req.query as unknown as FiltersType;

      const data = await users.loginHistories(user_id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Login histories',
        ...data
      });
    } catch (e) {
      return next(e);
    }
  };
}
