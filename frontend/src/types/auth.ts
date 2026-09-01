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
  accessToken: string;
}