import axios from 'axios';
import {
  AuthResponse,
  RegisterData,
  SendOTPData,
  VerifyOTPData,
  APIError,
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error((error.response.data as APIError).error || 'Registration failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Send OTP to email
export const sendOTP = async (data: SendOTPData): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>('/auth/send-otp', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error((error.response.data as APIError).error || 'Failed to send OTP');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Verify OTP and login
export const verifyOTP = async (data: VerifyOTPData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/verify-otp', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error((error.response.data as APIError).error || 'Invalid OTP');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Get current user (protected route)
export const getCurrentUser = async (token: string): Promise<{ user: any }> => {
  try {
    const response = await api.get<{ user: any }>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error((error.response.data as APIError).error || 'Failed to fetch user');
    }
    throw new Error('Network error. Please try again.');
  }
};
