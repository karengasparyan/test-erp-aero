import Users from '../models/Users';

export interface TokenData extends Users {
  device?: string;
}

export interface SignInType {
  email: string;
  password: string;
  device: string;
}
