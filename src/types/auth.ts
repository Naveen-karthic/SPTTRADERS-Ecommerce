export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface SendOTPData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface APIError {
  error: string;
}
