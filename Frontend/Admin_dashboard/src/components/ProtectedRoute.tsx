import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleRedirectedToken, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ProtectedRoute: Starting token validation...');
    
    // First check if we have a token in the URL
    const hasRedirectedToken = handleRedirectedToken();
    console.log('ProtectedRoute: Token from URL processed:', hasRedirectedToken);
    
    // If no token in URL and no token in localStorage, redirect to login
    if (!hasRedirectedToken && !isAuthenticated()) {
      console.log('ProtectedRoute: No valid token found, redirecting to login');
      // Store the current path to redirect back after login
      const currentPath = location.pathname;
      navigate(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    console.log('ProtectedRoute: Token validation successful, setting loading to false');
    // Add a small delay to ensure token processing is complete
    // This prevents race conditions with child components making API calls
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  // Show loading state while processing token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 