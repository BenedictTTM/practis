'use client';

import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full text-center relative">
        {/* Large 404 Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <h1 className="text-[380px] sm:text-[420px] md:text-[440px] font-bold text-gray-200 leading-none select-none">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16 sm:pt-20 md:pt-24">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page not found
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          {/* Requested URL */}
          <div className="mb-8 px-4">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-2 break-all">
              Requested URL: <span className="text-gray-700 font-medium">/about</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <Home size={18} />
              Back to Home
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded border border-gray-300 shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Popular Pages */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">Or try one of these popular pages:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/main/products"
                className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded border border-gray-300 shadow-sm hover:shadow transition-all duration-200"
              >
                Home
              </a>
            
              <a
                href="/main/about"
                className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded border border-gray-300 shadow-sm hover:shadow transition-all duration-200"
              >
                About
              </a>
              <a
                href="/main/contact"
                className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded border border-gray-300 shadow-sm hover:shadow transition-all duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}