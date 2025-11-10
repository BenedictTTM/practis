'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Log error to monitoring service
    console.error('Error boundary caught:', error);
  }, [error]);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleRetry = () => {
    reset();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        {/* Error 500 Badge */}
        <div className="mb-6">
          <h2 className="text-red-500 font-bold text-2xl sm:text-3xl">Error 500</h2>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Oops! Something went wrong.
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          An unexpected issue occurred. Our team has been notified. You can either return to the homepage or try your last action again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleBackToHome}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Back to Home
          </button>
          <button
            onClick={handleRetry}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>

        {/* Technical Details Accordion */}
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left text-gray-900 hover:text-gray-700 transition-colors duration-200 pb-4 border-b border-gray-200"
          >
            <span className="font-medium text-base">Show technical details</span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Collapsible Details */}
          {showDetails && (
            <div className="mt-6 text-left bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fadeIn">
              <div className="space-y-4">
                {/* Error Message */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Error Message
                  </h3>
                  <p className="text-sm text-gray-800 font-mono break-words bg-white p-3 rounded border border-gray-200">
                    {error.message || 'Unknown error occurred'}
                  </p>
                </div>

                {/* Error Digest */}
                {error.digest && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Error ID
                    </h3>
                    <p className="text-sm text-gray-800 font-mono bg-white p-3 rounded border border-gray-200">
                      {error.digest}
                    </p>
                  </div>
                )}

                {/* Stack Trace */}
                {error.stack && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Stack Trace
                    </h3>
                    <div className="text-xs text-gray-700 font-mono bg-white p-3 rounded border border-gray-200 max-h-48 overflow-auto">
                      <pre className="whitespace-pre-wrap break-words">{error.stack}</pre>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Timestamp
                  </h3>
                  <p className="text-sm text-gray-800 font-mono bg-white p-3 rounded border border-gray-200">
                    {new Date().toISOString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Support Link */}
        <div className="text-center mt-8">
          <a
            href="/main/contact"
            className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}