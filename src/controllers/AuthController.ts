import { Request, Response, NextFunction } from 'express';
import { Status, Success } from '../types/Global';
import { ConfirmEmailType, ForgotPasswordType, GetAccessTokenType, ResetPasswordType, SignUpType } from '../schemas/auth.schema';
import * as auth from '../services/Auth';
import { getDevice } from '../utils/helps';
import { SignInType } from '../types/Users';

export default class AuthController {
  static SignUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.body as SignUpType;

      const data = await auth.signUp(payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Please verify your email',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static SignIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.body as SignInType;

      payload.device = getDevice({ device: payload.device, userAgent: req.headers['user-agent'] });

      const data = await auth.signIn(payload, req.ip);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Login successfully',
        data: {
          ...data,
          device: payload.device
        }
      });
    } catch (e) {
      return next(e);
    }
  };

  static ConfirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { token } = req.body as ConfirmEmailType;

      await auth.confirmEmail(token);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Email successfully confirm'
      });
    } catch (e) {
      return next(e);
    }
  };

  static ForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.body as ForgotPasswordType;

      await auth.forgotPassword(payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Email successfully sent'
      });
    } catch (e) {
      return next(e);
    }
  };

  static ResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.body as ResetPasswordType;

      await auth.resetPassword(payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Password successfully reset'
      });
    } catch (e) {
      return next(e);
    }
  };

  static GetAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.body as GetAccessTokenType;

      const data = await auth.getAccessToken(payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Tokens data',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        user: { id, device }
      } = req;

      await auth.logout(id, device);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Logout successfully'
      });
    } catch (e) {
      return next(e);
    }
  };
}
