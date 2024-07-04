import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { ConfirmEmailSchema, ForgotPasswordSchema, ResetPasswordSchema, SignInSchema, SignUpSchema } from '../schemas/auth.schema';
import AuthorizationMiddleware from '../middlewares/authorization.middleware';

const router = Router();

router.post('/sign-up', ValidationMiddleware(SignUpSchema), AuthController.SignUp);

router.post('/sign-in', ValidationMiddleware(SignInSchema), AuthController.SignIn);

router.post('/confirm-email', ValidationMiddleware(ConfirmEmailSchema), AuthController.ConfirmEmail);

router.post('/forgot-password', ValidationMiddleware(ForgotPasswordSchema), AuthController.ForgotPassword);

router.put('/reset-password', ValidationMiddleware(ResetPasswordSchema), AuthController.ResetPassword);

router.post('/access-token', ValidationMiddleware(ConfirmEmailSchema), AuthController.GetAccessToken);

router.post('/logout', AuthorizationMiddleware(), AuthController.Logout);

export default router;
