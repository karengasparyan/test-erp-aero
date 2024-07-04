import sha256 from 'crypto-js/sha256';
import { decode, sign, verify } from 'jsonwebtoken';
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH, USER_PASSWORD_SECRET } from '../config';
import { SIZE_LIMIT } from './constants';
import { redisClient } from '../options/Redis';
import { TokenData } from '../types/Users';

export const hashedPassword = (password: string): string => {
  return sha256(sha256(password).toString() + USER_PASSWORD_SECRET).toString();
};

export const generateToken = async (user: TokenData | {}, jwtSecret: string, expiresIn: string) => {
  return sign({ user }, jwtSecret, { expiresIn });
};

export const validateToken = async (token: string, jwtSecret: string): Promise<{ user: TokenData }> => {
  return verify(token, jwtSecret) as { user: TokenData };
};

export const decodeToken = async (token: string) => {
  return decode(token) as { user: TokenData };
};

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : SIZE_LIMIT;

  const offset = page ? (+page - 1) * limit : 0;

  return { limit, offset };
};

export const jwtError = (error: string) => {
  switch (error) {
    case 'TokenExpiredError':
      return 'Token has expired';
    case 'JsonWebTokenError':
      return 'Invalid token or signature';
    default:
      return 'Token error';
  }
};

export const toBool = (stringBool: boolean) => String(stringBool).toLowerCase() === 'true';

export const corsOptions = {
  origin: ['https://erp.aero'],
  credentials: true
};

export const getTokens = async (user: TokenData, device: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken: string = await generateToken({ ...user.dataValues, device }, JWT_SECRET_ACCESS as string, '8h');

  const refreshToken: string = await generateToken({ ...user.dataValues, device }, JWT_SECRET_REFRESH as string, '72h');

  await redisClient.set(`users:${user.id}:${device}:accessToken`, accessToken);

  await redisClient.set(`users:${user.id}:${device}:refreshToken`, refreshToken);

  return { accessToken, refreshToken };
};

export const getDevice = ({ device, userAgent }: { device?: string; userAgent?: string }): string => {
  // req.headers['user-agent']

  if (device) return device;

  if (userAgent) {
    // Detect Chrome
    let chromeAgent = userAgent.indexOf('Chrome') > -1;

    // Detect Internet Explorer
    let IExplorerAgent = userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('rv:') > -1;

    // Detect Firefox
    let firefoxAgent = userAgent.indexOf('Firefox') > -1;

    // Detect Safari
    let safariAgent = userAgent.indexOf('Safari') > -1;

    // Discard Safari since it also matches Chrome
    if (chromeAgent && safariAgent) safariAgent = false;

    // Detect Opera
    let operaAgent = userAgent.indexOf('OP') > -1;

    // Discard Chrome since it also matches Opera
    if (chromeAgent && operaAgent) chromeAgent = false;

    if (chromeAgent) return 'Chrome';

    if (IExplorerAgent) return 'Internet Explorer';

    if (firefoxAgent) return 'Firefox';

    if (safariAgent) return 'Safari';

    if (operaAgent) return 'Opera';
  }

  return 'Unknown Device';
};
