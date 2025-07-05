import React from 'react';
import PaymentConfigForm from '../components/forms/PaymentConfigForm';
import StudentPaymentSearch from '../components/forms/StudentPaymentSearch';
import { CreditCard } from 'lucide-react';

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Payment Management</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PaymentConfigForm />
        </div>
        
        <div className="space-y-6">
          <StudentPaymentSearch />
        </div>
      </div>
    </div>
  );
};

export default Payments; 