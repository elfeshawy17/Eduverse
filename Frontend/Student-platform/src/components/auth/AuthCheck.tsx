import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken, initAuth, storeRedirectPath, extractTokenFromUrl } from '@/utils/auth';

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication by checking URL for token
  useEffect(() => {
    // First check if there's a token in the URL
    const urlToken = extractTokenFromUrl();
    if (urlToken) {
      // If token exists in URL, initialize auth and set it
      initAuth();
    }
    setIsInitialized(true);
  }, []);

  // If not initialized yet, don't render anything
  if (!isInitialized) {
    return null;
  }

  // Check if user is authenticated
  const isAuthenticated = !!getToken();

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Store current path for redirect after login
    const currentPath = location.pathname;
    storeRedirectPath(currentPath);
    
    // Use window.location for external redirects instead of Navigate
    window.location.href = `http://localhost:5173/eduverse/login?redirect=${encodeURIComponent(currentPath)}`;
    return null;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default AuthCheck; 