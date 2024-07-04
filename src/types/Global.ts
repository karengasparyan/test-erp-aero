import { TokenData } from './Users';

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  STAGING = 'staging'
}

export enum Status {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  INTERNAL_SERVER_ERROR = 500
}

export enum Success {
  OK = 'ok',
  FAIL = 'fail',
  ERROR = 'error'
}

export interface RedisData {
  accessToken: string;
  refreshToken: string;
  verificationToken: string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortField {
  NAME = 'name',
  EMAIL = 'email',
  MIMETYPE = 'mimetype',
  EXTENSION = 'extension',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

declare global {
  namespace Express {
    interface Request {
      user_id: string;
      user: TokenData;
    }
  }
}

export interface GetAllData<T> {
  rows: T[];
  count: number;
}
