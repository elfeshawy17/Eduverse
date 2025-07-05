# Student Payment Workflow Implementation

This document describes the complete student payment workflow implementation in the React frontend application.

## Overview

The payment workflow ensures that students must complete payment before accessing the learning platform. The system automatically checks payment status after login and redirects users accordingly.

## Workflow Flow

1. **Student Login** → Authentication completed
2. **Automatic Payment Check** → Frontend calls `/api/payment/student/status`
3. **Platform Access Control**:
   - If `isPaid: true` → Allow platform access (redirect to dashboard/courses)
   - If `isPaid: false` or no payment record → Block access (redirect to payment gate)
4. **Payment Gate** → Student sees "Pay Now" or "Logout" options
5. **Stripe Payment** → Student completes payment on Stripe
6. **Payment Result**:
   - Success → Redirect to success page, then to platform
   - Failure → Redirect to failure page, still blocked

## Components Structure

### Core Components

- **`PaymentGate`** (`src/pages/student/PaymentGate.tsx`)
  - Main payment gate page
  - Handles "Pay Now" and "Logout" actions
  - Creates Stripe checkout session

- **`PaymentSuccess`** (`src/pages/student/PaymentSuccess.jsx`)
  - Displays after successful payment
  - Verifies payment completion
  - Redirects to platform

- **`PaymentFailure`** (`src/pages/student/PaymentFailure.jsx`)
  - Displays after failed payment
  - Provides retry and home navigation options

### Context and Hooks

- **`PaymentContext`** (`src/contexts/PaymentContext.tsx`)
  - Global payment state management
  - Provides payment status across the app
  - Handles payment status checking and refreshing

- **`usePayment`** (`src/hooks/use-payment.ts`)
  - Custom hook for payment operations
  - Handles payment status checking and navigation

### API Integration

- **Payment API functions** (`src/utils/api.ts`)
  - `checkPaymentStatus()` - Check current payment status
  - `createPaymentSession()` - Create Stripe checkout session
  - TypeScript interfaces for payment data

### Route Protection

- **`ProtectedRoute`** (`src/components/auth/ProtectedRoute.tsx`)
  - Enhanced to include payment verification
  - Automatically redirects unpaid users to payment gate
  - Shows loading state during payment check

## API Endpoints

### 1. GET /api/payment/student/status

**Description**: Check current payment status for authenticated student

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "_id": "payment_id",
    "student": "student_id",
    "orderId": "pi_stripe_payment_intent_id",
    "level": 1,
    "term": 1,
    "courses": ["course_id_1", "course_id_2"],
    "totalHours": 30,
    "hourRate": 50,
    "totalAmount": 1500,
    "isPaid": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. POST /api/payment/create-session

**Description**: Create Stripe checkout session for student payment

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response**:
```json
{
  "success": "SUCCESS",
  "data": {
    "id": "cs_test_stripe_session_id",
    "object": "checkout.session",
    "url": "https://checkout.stripe.com/c/pay/cs_test_...",
    "payment_status": "unpaid",
    "amount_total": 150000,
    "currency": "usd",
    "customer_email": "student@example.com",
    "mode": "payment",
    "status": "open"
  }
}
```

## Routing Structure

```typescript
// Payment routes (no protection needed)
/student/payment-success  // Payment success page
/student/payment-failure  // Payment failure page
/student/payment-gate     // Payment gate page

// Protected routes (require authentication + payment)
/                        // Main dashboard
/course/:courseId        // Course details
/profile                 // User profile
```

## Usage Examples

### Checking Payment Status

```typescript
import { usePaymentContext } from '@/contexts/PaymentContext';

const MyComponent = () => {
  const { isLoading, hasPaid, paymentData, checkPayment } = usePaymentContext();

  if (isLoading) {
    return <div>Checking payment...</div>;
  }

  if (!hasPaid) {
    return <div>Payment required</div>;
  }

  return <div>Welcome to your courses!</div>;
};
```

### Creating Payment Session

```typescript
import { createPaymentSession } from '@/utils/api';

const handlePayment = async () => {
  try {
    const result = await createPaymentSession();
    if (result.success === 'SUCCESS') {
      window.location.href = result.data.url;
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### Payment Status Indicator

```typescript
import PaymentStatusIndicator from '@/components/payment/PaymentStatusIndicator';

const Header = () => {
  return (
    <header>
      <h1>Student Platform</h1>
      <PaymentStatusIndicator />
    </header>
  );
};
```

## Configuration

### Environment Variables

Ensure your backend API is properly configured with:

- Stripe API keys
- Payment configuration for different levels/terms
- Webhook endpoints for payment status updates

### Stripe Configuration

The frontend expects the backend to:

1. Create Stripe checkout sessions
2. Handle webhook events from Stripe
3. Update payment status in the database
4. Provide payment status API endpoints

## Error Handling

The system includes comprehensive error handling:

- **Network errors**: Fallback to payment gate
- **API errors**: Display user-friendly error messages
- **Payment verification failures**: Redirect to payment gate
- **Authentication errors**: Redirect to login

## Security Considerations

1. **Token-based authentication**: All payment API calls require valid JWT tokens
2. **Server-side verification**: Payment status is verified on the backend
3. **Secure redirects**: Stripe handles sensitive payment information
4. **Webhook verification**: Backend verifies Stripe webhook signatures

## Testing

### Manual Testing Flow

1. Login as a student
2. Verify automatic redirect to payment gate if unpaid
3. Test "Pay Now" button (redirects to Stripe)
4. Test "Logout" button
5. Complete payment on Stripe
6. Verify redirect to success page
7. Verify access to platform after payment

### Test Scenarios

- Student with no payment record
- Student with unpaid payment record
- Student with paid payment record
- Payment verification failure
- Network errors during payment check
- Stripe payment failure

## Troubleshooting

### Common Issues

1. **Payment status not updating**: Check webhook configuration
2. **Infinite loading**: Verify API endpoints are accessible
3. **Redirect loops**: Check payment status logic
4. **Authentication errors**: Verify JWT token handling

### Debug Information

Enable console logging to debug payment flow:

```typescript
// In PaymentContext
console.log('Payment status:', { isLoading, hasPaid, error });
```

## Future Enhancements

1. **Payment history**: Display past payments
2. **Payment plans**: Support for different payment options
3. **Refund handling**: Process refunds through Stripe
4. **Payment reminders**: Notify unpaid students
5. **Analytics**: Track payment conversion rates 