import React, { createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/api.service';
import { LoginCredentials } from '../types/auth.types';

interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<{ token: string; role: string } | null>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [error, setError] = React.useState<string | null>(null);
  
  const login = async (credentials: LoginCredentials): Promise<{ token: string; role: string } | null> => {
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.status.toLowerCase() === 'success' && response.data) {
        return {
          token: response.data.token,
          role: response.data.user.role
        };
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch {
      setError('An unexpected error occurred');
      return null;
    }
  };
  
  const value = {
    login,
    error,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};