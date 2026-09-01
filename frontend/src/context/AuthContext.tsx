import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  authApi,
} from '../api/auth.api';

import type {
  LoginRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  User,
} from '../types/auth';

import {
  AuthContext,
} from './auth-context';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  useEffect(() => {
    const restoreSession =
      async () => {
        const token =
          localStorage.getItem(
            'accessToken',
          );

        if (!token) {
          setIsLoading(
            false,
          );

          return;
        }

        try {
          const currentUser =
            await authApi
              .getCurrentUser();

          setUser(
            currentUser,
          );
        } catch {
          localStorage.removeItem(
            'accessToken',
          );

          setUser(null);
        } finally {
          setIsLoading(
            false,
          );
        }
      };

    void restoreSession();
  }, []);

  const login = async (
    credentials: LoginRequest,
  ) => {
    const response =
      await authApi.login(
        credentials,
      );

    localStorage.setItem(
      'accessToken',
      response.accessToken,
    );

    /*
     * We still fetch /auth/me instead of trusting
     * only the login response. This keeps one
     * canonical source for the authenticated user.
     */
    const currentUser =
      await authApi
        .getCurrentUser();

    setUser(
      currentUser,
    );
  };

  const register = async (
    payload: RegisterRequest,
  ) => {
    await authApi.register(
      payload,
    );
  };

  const updateProfile =
    async (
      payload:
        UpdateProfileRequest,
    ) => {
      const updatedUser =
        await authApi
          .updateProfile(
            payload,
          );

      /*
       * This immediately refreshes every component
       * consuming AuthContext:
       *
       * Sidebar
       * TopBar
       * Dashboard
       * Settings
       */
      setUser(
        updatedUser,
      );

      return updatedUser;
    };

  const changePassword =
    async (
      payload:
        UpdatePasswordRequest,
    ) => {
      return authApi
        .changePassword(
          payload,
        );
    };

  const logout = () => {
    localStorage.removeItem(
      'accessToken',
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}