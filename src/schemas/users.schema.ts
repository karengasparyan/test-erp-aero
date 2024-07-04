import { object, string, TypeOf } from 'zod';
import { PASSWORD_REGEX } from '../utils/constants';

export const UpdateInfoSchema = object({
  body: object({
    name: string().min(2).max(128)
  }).strict()
});

export const ChangePasswordSchema = object({
  body: object({
    password: string().regex(PASSWORD_REGEX, { message: 'Password is invalid' }),
    oldPassword: string().regex(PASSWORD_REGEX, { message: 'OldPassword is invalid' })
  })
});

export type UpdateInfoType = TypeOf<typeof UpdateInfoSchema>['body'];

export type ChangePasswordType = TypeOf<typeof ChangePasswordSchema>['body'];
