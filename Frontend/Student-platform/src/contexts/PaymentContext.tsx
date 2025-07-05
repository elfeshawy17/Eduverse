import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkPaymentStatus, PaymentStatus } from '@/utils/api';
import { getToken } from '@/utils/auth';

interface PaymentContextType {
  isLoading: boolean;
  hasPaid: boolean | null;
  paymentData: PaymentStatus | null;
  error: string | null;
  checkPayment: () => Promise<void>;
  refreshPayment: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPayment = async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      setHasPaid(false);
      setError('No authentication token found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkPaymentStatus();
      
      if (result.status === 'SUCCESS') {
        const paid = result.data?.isPaid || false;
        setHasPaid(paid);
        setPaymentData(result.data);
      } else {
        setHasPaid(false);
        setPaymentData(null);
        setError(result.message || 'Failed to check payment status');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setHasPaid(false);
      setPaymentData(null);
      setError('Failed to check payment status');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPayment = async () => {
    await checkPayment();
  };

  useEffect(() => {
    checkPayment();
  }, []);

  const value: PaymentContextType = {
    isLoading,
    hasPaid,
    paymentData,
    error,
    checkPayment,
    refreshPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
}; 