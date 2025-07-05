import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleRedirectedToken, isAuthenticated } from '../lib/auth';

const LOGIN_URL = 'http://localhost:5173/eduverse/login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First check if we have a token in the URL
    const hasRedirectedToken = handleRedirectedToken();
    // If no token in URL and no token in localStorage, redirect to login
    if (!hasRedirectedToken && !isAuthenticated()) {
      // Store the current path to redirect back after login
      const currentPath = location.pathname + location.search;
      window.location.href = `${LOGIN_URL}?returnUrl=${encodeURIComponent(currentPath)}`;
      return;
    }
  }, [location]);

  return <>{children}</>;
};

export default ProtectedRoute; 