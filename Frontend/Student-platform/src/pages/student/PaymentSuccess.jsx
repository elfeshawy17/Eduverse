import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { usePaymentContext } from '@/contexts/PaymentContext';

const PaymentSuccess = () => {
  // All hooks at the top!
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshPayment, hasPaid } = usePaymentContext();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Debug: Log all URL parameters to see what Stripe is sending
    const allParams = Object.fromEntries(params.entries());
    console.log('URL Parameters:', allParams);
    console.log('Current URL:', location.href);
    console.log('Pathname:', location.pathname);
    console.log('Search:', location.search);
    
    setDebugInfo(JSON.stringify(allParams, null, 2));
    
    // Check for various possible Stripe parameters
    const sessionId = params.get('session_id');
    const paymentIntentId = params.get('payment_intent');
    const paymentIntentClientSecret = params.get('payment_intent_client_secret');
    const setupIntentId = params.get('setup_intent');
    const setupIntentClientSecret = params.get('setup_intent_client_secret');
    
    // Also check for other common parameters
    const successParam = params.get('success');
    const canceledParam = params.get('canceled');
    const errorParam = params.get('error');
    
    // If we have any of these parameters, consider it a successful redirect
    const hasStripeParams = sessionId || paymentIntentId || setupIntentId;
    
    // Check if this is a canceled payment
    if (canceledParam === 'true') {
      setError('Payment was canceled. Please try again.');
      setLoading(false);
      return;
    }
    
    // Check if there was an error
    if (errorParam) {
      setError(`Payment error: ${errorParam}`);
      setLoading(false);
      return;
    }
    
    if (!hasStripeParams) {
      console.log('No Stripe parameters found in URL - using fallback verification');
      setIsFallback(true);
      // Use fallback verification - check if payment status has been updated
      verifyPaymentFallback();
      return;
    }

    // Standard verification with Stripe parameters
    verifyPaymentWithParams(sessionId, paymentIntentId, setupIntentId);
  }, [location.search]);

  const verifyPaymentWithParams = async (sessionId, paymentIntentId, setupIntentId) => {
    try {
      console.log('Verifying payment with parameters:', {
        sessionId,
        paymentIntentId,
        setupIntentId
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh payment status in context
      await refreshPayment();
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Payment verification failed. Please contact support.');
      setLoading(false);
    }
  };

  const verifyPaymentFallback = async () => {
    try {
      console.log('Using fallback payment verification');
      
      // Wait a bit for any backend processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh payment status to see if it was updated
      await refreshPayment();
      
      // Check if payment status indicates success
      if (hasPaid) {
        setSuccess(true);
        setLoading(false);
      } else {
        // If still not paid, show a message asking user to wait or contact support
        setError('Payment is being processed. Please wait a moment and try again, or contact support if the issue persists.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Fallback verification error:', err);
      setError('Unable to verify payment status. Please contact support.');
      setLoading(false);
    }
  };

  const handleGoToCourses = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate('/student/payment-gate');
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      await refreshPayment();
      if (hasPaid) {
        setSuccess(true);
      } else {
        setError('Payment is still being processed. Please try again later.');
      }
    } catch (err) {
      setError('Failed to refresh payment status. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Now do your conditional rendering
  if (hasPaid === true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
            <CardDescription className="text-gray-600">
              You now have full access to your courses and learning materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Welcome to your learning journey! You can now access all your enrolled courses, 
                lectures, assignments, and learning resources.
              </p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Go to My Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isFallback ? 'Processing payment...' : 'Verifying payment...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600">Payment Processing</CardTitle>
            <CardDescription className="text-gray-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full"
              variant="default"
            >
              Refresh Status
            </Button>
            <Button 
              onClick={handleRetryPayment}
              className="w-full"
              variant="outline"
            >
              Try Payment Again
            </Button>
            <Button 
              onClick={handleGoToCourses}
              className="w-full"
              variant="secondary"
            >
              Go to Courses
            </Button>
            
            {/* Debug information - remove in production */}
            {debugInfo && (
              <details className="mt-4 text-xs text-gray-500">
                <summary>Debug Info</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
                  {debugInfo}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
          <CardDescription className="text-gray-600">
            You now have full access to your courses and learning materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Welcome to your learning journey! You can now access all your enrolled courses, 
              lectures, assignments, and learning resources.
            </p>
          </div>
          
          <Button
            onClick={handleGoToCourses}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Go to My Courses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess; 