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

    const verifyPayment = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reference: ref }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Payment successful! Your slots have been credited.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    router.push('/accounts/slots-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4 font-heading">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md overflow-hidden">
        {/* LOADING */}
        {status === 'loading' && (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white relative">
  {/* Wrapper shifted slightly upward */}
  <div className="transform -translate-y-10">
    <div className="flex flex-col items-center justify-center text-center px-6 sm:px-10 py-12 sm:py-16 bg-gradient-to-b from-white via-blue-50 to-white rounded-2xl shadow-lg border border-blue-100">
      {/* Spinner Container */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-red-100 blur-xl opacity-60 animate-pulse"></div>

        {/* Main Spinner */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-inner border border-blue-200">
          <svg
            className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-red-500 drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-extrabold text-gray-900 mb-2 tracking-tight">
        Processing...
      </h1>

      {/* Message */}
      <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">
        {message || "Please hold on while we complete your request."}
      </p>

      {/* Progress Bar */}
      <div className="mt-6 w-40 h-1 bg-red-100 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-red-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  </div>

  {/* Custom animation keyframes */}
  <style jsx>{`
    @keyframes progress {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(50%); }
      100% { transform: translateX(100%); }
    }
  `}</style>
</div>

        )}

        {/* SUCCESS */}
        {status === 'success' && (
          <div className="text-center px-5 sm:px-8 py-10 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-500 mb-5 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              Your slots have been credited to your account.
            </p>

            {reference && (
              <div className="mb-6 sm:mb-8">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-medium">
                  Transaction Reference
                </p>
                <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                  {reference}
                </p>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-xl"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="text-center px-5 sm:px-8 py-10 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-500 mb-5 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">{message}</p>

            <button
              onClick={() => router.push('/accounts/slots-dashboard')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-xl"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
