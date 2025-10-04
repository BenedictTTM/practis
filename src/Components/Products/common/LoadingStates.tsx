import React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  subText?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, subText, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 font-semibold text-lg mb-2">{message}</div>
        {subText && (
          <div className="text-red-500 text-sm mb-4">{subText}</div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function NotFoundMessage({ title = "Product not found", message = "The product you're looking for doesn't exist." }) {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-gray-800 font-semibold text-lg mb-2">{title}</div>
        <div className="text-gray-600 text-sm">{message}</div>
      </div>
    </div>
  );
}