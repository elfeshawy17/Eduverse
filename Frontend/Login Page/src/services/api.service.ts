import { LoginCredentials, AuthResponse } from '../types/auth.types';

const API_URL = 'http://localhost:3000/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        // إزالة credentials: 'include' لأنها غير مطلوبة مع استخدام localStorage
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          status: 'fail',
          message: data.message || 'An error occurred during login',
        };
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'fail',
        message: 'Network error. Please try again later.',
      };
    }
  },

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};