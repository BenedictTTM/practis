'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { slotService } from '@/services/slotService';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('reference');
    
    if (!ref) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }

    setReference(ref);

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        // Give the webhook a moment to process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Call verification endpoint
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ reference: ref }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Payment successful! Your slots have been credited to your account.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed. Please contact support if payment was deducted.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support if slots were not credited.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    router.push('/accounts/slots-dashboard'); // Redirect to slots dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-heading">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {status === 'loading' && (
          <div className="text-center px-8 py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6 animate-pulse">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Processing Payment</h1>
            <p className="text-gray-500 text-sm font-heading">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center px-8 py-12">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-red-500 mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Payment Successful!</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-heading">
              Your payment was successful and your slots have been credited to your account.
            </p>
            
            {/* Transaction Reference */}
            {reference && (
              <div className="mb-8">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium font-heading">
                  Transaction Reference
                </p>
                <p className="text-sm font-heading text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 break-all">
                  {reference}
                </p>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-heading"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center px-8 py-12">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-red-500 mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Payment Verification Failed</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-heading">{message}</p>
            
            {/* Action Button */}
            <button
              onClick={() => router.push('/accounts/slots-dashboard')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-heading"
            >
              Go to Slots Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
