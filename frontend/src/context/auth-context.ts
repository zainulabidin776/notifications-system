import {
  createContext,
} from 'react';

import type {
  LoginRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfileRequest,
  User,
} from '../types/auth';

export interface AuthContextValue {
  user: User | null;

  isLoading: boolean;

  login: (
    credentials: LoginRequest,
  ) => Promise<void>;

  register: (
    payload: RegisterRequest,
  ) => Promise<void>;

  updateProfile: (
    payload: UpdateProfileRequest,
  ) => Promise<User>;

  changePassword: (
    payload: UpdatePasswordRequest,
  ) => Promise<UpdatePasswordResponse>;

  logout: () => void;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);