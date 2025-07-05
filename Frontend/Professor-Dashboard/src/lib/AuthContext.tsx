import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, handleRedirectedToken } from './auth';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Handle initial auth redirect
    handleRedirectedToken();
    setAuthenticated(isAuthenticated());
  }, []);

  const logout = () => {
    // ...your logout logic
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 