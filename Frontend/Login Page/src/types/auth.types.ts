export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'professor' | 'student';

export interface AuthResponse {
  status: 'success' | 'fail';
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}