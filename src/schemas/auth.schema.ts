import { object, string, TypeOf } from 'zod';
import { PASSWORD_REGEX } from '../utils/constants';

export const SignUpSchema = object({
  body: object({
    name: string().min(2).max(128),
    email: string().email().min(8).max(320),
    password: string().regex(PASSWORD_REGEX, { message: 'Password is invalid' })
  }).strict()
});

export const SignInSchema = object({
  body: object({
    email: string().email(),
    device: string().min(2).max(128).nullable().optional(),
    password: string().regex(PASSWORD_REGEX, { message: 'Password is invalid' })
  }).strict()
});

export const ConfirmEmailSchema = object({
  body: object({
    token: string().min(2).max(1024)
  })
});

export const GetAccessTokenSchema = object({
  body: object({
    token: string().min(2).max(1024),
    device: string().min(2).max(128)
  })
});

export const ForgotPasswordSchema = object({
  body: object({
    email: string().email().min(8).max(320)
  })
});

export const ResetPasswordSchema = object({
  body: object({
    token: string().min(2).max(1024),
    password: string().regex(PASSWORD_REGEX, { message: 'Password is invalid' }),
    repeatPassword: string().regex(PASSWORD_REGEX, { message: 'RepeatPassword is invalid' })
  })
});

export type SignUpType = TypeOf<typeof SignUpSchema>['body'];

export type ConfirmEmailType = TypeOf<typeof ConfirmEmailSchema>['body'];

export type GetAccessTokenType = TypeOf<typeof GetAccessTokenSchema>['body'];

export type ForgotPasswordType = TypeOf<typeof ForgotPasswordSchema>['body'];

export type ResetPasswordType = TypeOf<typeof ResetPasswordSchema>['body'];
