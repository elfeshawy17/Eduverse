import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPaymentStatus, PaymentStatus } from '@/utils/api';
import { getToken } from '@/utils/auth';

export interface PaymentState {
  isLoading: boolean;
  hasPaid: boolean | null;
  paymentData: PaymentStatus | null;
  error: string | null;
}

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: true,
    hasPaid: null,
    paymentData: null,
    error: null,
  });
  const navigate = useNavigate();

  const checkPayment = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setPaymentState({
        isLoading: false,
        hasPaid: false,
        paymentData: null,
        error: 'No authentication token found',
      });
      return;
    }

    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await checkPaymentStatus();
      
      if (result.status === 'SUCCESS') {
        const hasPaid = result.data?.isPaid || false;
        setPaymentState({
          isLoading: false,
          hasPaid,
          paymentData: result.data,
          error: null,
        });
      } else {
        setPaymentState({
          isLoading: false,
          hasPaid: false,
          paymentData: null,
          error: result.message || 'Failed to check payment status',
        });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentState({
        isLoading: false,
        hasPaid: false,
        paymentData: null,
        error: 'Failed to check payment status',
      });
    }
  }, []);

  const redirectBasedOnPayment = useCallback(() => {
    if (paymentState.isLoading) return;

    if (paymentState.hasPaid) {
      // User has paid, allow access to platform
      navigate('/');
    } else {
      // User hasn't paid, redirect to payment gate
      navigate('/student/payment-gate');
    }
  }, [paymentState.isLoading, paymentState.hasPaid, navigate]);

  useEffect(() => {
    checkPayment();
  }, [checkPayment]);

  return {
    ...paymentState,
    checkPayment,
    redirectBasedOnPayment,
  };
}; 