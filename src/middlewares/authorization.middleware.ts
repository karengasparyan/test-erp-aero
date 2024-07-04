import { Request, Response, NextFunction } from 'express';
import * as users from '../services/Users';
import { jwtError, validateToken } from '../utils/helps';
import { JWT_SECRET_ACCESS } from '../config';
import { Users } from '../models';
import { redisClient } from '../options/Redis';
import { Status, Success } from '../types/Global';
import { TokenData } from '../types/Users';
import { TOKEN_TYPE } from '../utils/constants';

export default function AuthorizationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization as string;

      if (!token) {
        return res.status(Status.UNAUTHORIZED).json({
          success: Success.FAIL,
          message: 'Invalid authorization key'
        });
      }

      if (token.toLowerCase().startsWith(TOKEN_TYPE)) {
        token = token.slice(TOKEN_TYPE.length).trim();
      }

      const { user }: { user: TokenData } = await validateToken(token, JWT_SECRET_ACCESS as string);

      const session = await redisClient.get(`users:${user.id}:${user.device}:accessToken`);

      if (!user || !session) {
        return res.status(Status.UNAUTHORIZED).json({
          success: Success.FAIL,
          message: 'Authorization fail'
        });
      }

      const userFound: Users | null = await users.getById(user.id);

      if (!userFound) {
        return res.status(Status.NOT_FOUND).json({
          success: Success.FAIL,
          message: 'User is not found'
        });
      }

      req.user = user;

      req.user_id = user.id;

      return next();
    } catch (e: any) {
      if (e.name === 'TokenExpiredError') {
        return res.status(Status.FORBIDDEN).json({
          success: Success.FAIL,
          message: jwtError(e.name)
        });
      }
      return res.status(Status.UNAUTHORIZED).json({
        success: Success.FAIL,
        message: jwtError(e.name)
      });
    }
  };
}
