import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, CreditCard } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/student/payment-gate');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Failed</CardTitle>
          <CardDescription className="text-gray-600">
            Something went wrong with your payment. Please try again or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleTryAgain}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>If you continue to experience issues, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure; 