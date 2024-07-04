import { redisClient } from '../options/Redis';
import { LoginHistories, Users } from '../models';
import { ForgotPasswordType, GetAccessTokenType, ResetPasswordType, SignUpType } from '../schemas/auth.schema';
import HttpError from 'http-errors';
import { decodeToken, generateToken, getTokens, hashedPassword, jwtError, validateToken } from '../utils/helps';
import { FRONT_URL, JWT_SECRET_REFRESH, JWT_SECRET_VERIFY } from '../config';
import { Status } from '../types/Global';
import { Op, Sequelize } from 'sequelize';
import { sendEmail } from '../options/mailer';
import { TokenData, SignInType } from '../types/Users';

export const signUp = async (payload: SignUpType): Promise<Users | null> => {
  const { name, email, password } = payload;

  let checkUser = await Users.findOne({ where: { email } });

  if (checkUser) {
    throw HttpError(Status.BAD_REQUEST, 'Email already exist');
  }

  const user = await Users.create({ name, password, email: email.trim().toLowerCase() });

  const verificationToken = await generateToken(user, JWT_SECRET_VERIFY as string, '48h');

  await redisClient.set(`users:${user.id}:verificationToken`, verificationToken);

  await sendEmail(payload.email.trim().toLowerCase(), {
    name: payload.name,
    action: 'Please click to verify',
    token: `${FRONT_URL}/confirm-email?token=${verificationToken}`
  });

  return user;
};

export const loginHistoryUpToData = async (user_id: string, device: string, ip?: string): Promise<LoginHistories> => {
  let data = await LoginHistories.findOne({ where: { user_id, device } });

  const last_login = Sequelize.literal('CURRENT_TIMESTAMP');

  if (data) {
    await data.update({ ip, last_login });
  } else {
    data = await LoginHistories.create({ user_id, device, ip, last_login });
  }

  return data;
};

export const signIn = async (
  { email, password, device }: SignInType,
  ip?: string
): Promise<{ user: Users; accessToken: string; refreshToken: string }> => {
  const user = await Users.findOne({
    where: {
      email: email.trim().toLowerCase(),
      password: hashedPassword(password),
      verified_at: { [Op.not]: null }
    }
  });

  if (!user) throw HttpError(Status.BAD_REQUEST, 'Invalid email or password');

  const tokens = await getTokens(user, device);

  await loginHistoryUpToData(user.id, device, ip);

  return { user, ...tokens };
};

export const confirmEmail = async (token: string): Promise<boolean> => {
  const data: { user: TokenData } = await validateToken(token, JWT_SECRET_VERIFY as string);

  const user = await Users.findOne({ where: { id: data.user.id } });

  if (!user) throw HttpError(Status.NOT_FOUND, 'User is not found');

  const session = await redisClient.get(`users:${user.id}:verificationToken`);

  if (!session || token !== session) throw HttpError(Status.UNAUTHORIZED, 'Session fail');

  if (user.verified_at) throw HttpError(Status.BAD_REQUEST, 'User already verified');

  user.verified_at = new Date();

  await user.save();

  await redisClient.del(`users:${user.id}:verificationToken`);

  return true;
};

export const forgotPassword = async ({ email }: ForgotPasswordType) => {
  const user = await Users.findOne({
    where: {
      email: email.trim().toLowerCase()
    }
  });

  if (!user) throw HttpError(Status.BAD_REQUEST, 'Invalid email, email not found');

  const verificationToken = await generateToken(user, JWT_SECRET_VERIFY as string, '30m');

  await redisClient.set(`users:${user.id}:verificationToken`, verificationToken);

  await sendEmail(user.email.trim().toLowerCase(), {
    name: user.name,
    action: 'Please click to forgot password',
    token: `${FRONT_URL}/forgot-password?token=${verificationToken}`
  });

  return true;
};

export const resetPassword = async ({ token, password, repeatPassword }: ResetPasswordType): Promise<boolean> => {
  try {
    const { user }: { user: TokenData } = await validateToken(token, JWT_SECRET_VERIFY as string);

    if (!user) throw HttpError(Status.BAD_REQUEST, 'Reset password fail');

    const session = await redisClient.get(`users:${user.id}:verificationToken`);

    if (!session || token !== session) throw HttpError(Status.UNAUTHORIZED, 'Session fail');

    if (password !== repeatPassword) throw HttpError(Status.BAD_REQUEST, 'Password repeat fail');

    await Users.update({ password }, { where: { id: user.id } });

    await redisClient.del(`users:${user.id}:verificationToken`);

    return true;
  } catch (e: any) {
    throw HttpError(Status.UNAUTHORIZED, jwtError(e.name));
  }
};

export const getAccessToken = async ({ token, device }: GetAccessTokenType): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const { user }: { user: TokenData } = await validateToken(token, JWT_SECRET_REFRESH as string);

    if (!user) {
      throw HttpError(Status.BAD_REQUEST, 'Token send fail');
    }

    const session = await redisClient.get(`users:${user.id}:${device}:refreshToken`);

    if (!session || token !== session) throw HttpError(Status.UNAUTHORIZED, 'Session fail');

    return getTokens(user, device);
  } catch (e: any) {
    const {
      user: { id }
    } = await decodeToken(token);

    await redisClient.del(`users:${id}:${device}:accessToken`);

    await redisClient.del(`users:${id}:${device}:refreshToken`);

    throw HttpError(Status.UNAUTHORIZED, jwtError(e.name));
  }
};

export const logout = async (id: string, device?: string): Promise<boolean> => {
  const destroyAccessToken = await redisClient.del(`users:${id}:${device}:accessToken`);

  const destroyRefreshToken = await redisClient.del(`users:${id}:${device}:refreshToken`);

  if (!!destroyAccessToken && !!destroyRefreshToken) {
    return true;
  }

  throw HttpError(Status.UNAUTHORIZED, 'Session fail');
};
