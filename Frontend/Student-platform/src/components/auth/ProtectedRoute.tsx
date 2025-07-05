import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken, initAuth, storeRedirectPath, extractTokenFromUrl } from '@/utils/auth';
import { usePaymentContext } from '@/contexts/PaymentContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLoading, hasPaid, error } = usePaymentContext();

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

  // If authenticated but payment status is still loading, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  // If authenticated but payment check failed, redirect to payment gate
  if (error) {
    console.error('Payment check error:', error);
    // Redirect to payment gate as fallback
    window.location.href = '/eduverse/student/payment-gate';
    return null;
  }

  // If authenticated but hasn't paid, redirect to payment gate
  if (hasPaid === false) {
    window.location.href = '/eduverse/student/payment-gate';
    return null;
  }

  // If authenticated and has paid, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;