import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaymentSession } from '@/utils/api';
import { logout } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentGate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const result = await createPaymentSession();
      
      if (result.success === 'SUCCESS') {
        // Redirect to Stripe checkout
        window.location.href = result.data.url;
      } else {
        toast({
          title: "Payment Error",
          description: result.message || "Failed to create payment session. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Required</CardTitle>
          <CardDescription className="text-gray-600">
            You need to complete your payment to access your courses and learning materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              Once payment is completed, you'll have full access to all your enrolled courses, 
              lectures, assignments, and learning resources.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handlePayNow}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>Secure payment powered by Stripe</p>
            <p>Your payment information is encrypted and secure</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGate; 