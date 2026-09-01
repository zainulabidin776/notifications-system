export interface User {
  id: string;
  fullName: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface UpdateProfileRequest {
  fullName: string;
  username: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}