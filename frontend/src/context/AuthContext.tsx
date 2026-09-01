import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '../api/auth.api';
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

import { AuthContext } from './auth-context';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);

    localStorage.setItem(
      'accessToken',
      response.accessToken,
    );

    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
  };

  const register = async (payload: RegisterRequest) => {
    await authApi.register(payload);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}