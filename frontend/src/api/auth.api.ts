import { http } from './http';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types/auth';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>(
      '/auth/login',
      credentials,
    );

    return response.data;
  },

  async register(payload: RegisterRequest): Promise<User> {
    const response = await http.post<User>(
      '/auth/register',
      payload,
    );

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await http.get<User>('/auth/me');

    return response.data;
  },
};