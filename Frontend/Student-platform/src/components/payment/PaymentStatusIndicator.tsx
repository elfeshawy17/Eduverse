import React from 'react';
import { usePaymentContext } from '@/contexts/PaymentContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentStatusIndicator = () => {
  const { isLoading, hasPaid, error } = usePaymentContext();

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Checking...
      </Badge>
    );
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }

  if (hasPaid) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Paid
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <XCircle className="h-3 w-3" />
      Unpaid
    </Badge>
  );
};

export default PaymentStatusIndicator; 