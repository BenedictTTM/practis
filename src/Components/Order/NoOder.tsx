'use client';

import { useRouter } from 'next/navigation';

export default function NoOrdersPage() {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push('/shop'); // Change this to your actual shopping page (e.g. /main/products)
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-0 pt-6 pb-8 px-4 sm:pt-8 sm:pb-10 sm:px-6 md:px-8 text-center">
      <div className="w-full max-w-sm mx-auto">
        {/* Icon */}
        <div className="mx-auto rounded-full p-3 sm:p-4 mb-4 flex items-center justify-center bg-transparent shadow-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6M5 6h14l1 14H4L5 6z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-1">
          You haven't placed any orders yet!
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-500 mb-4">
          All your future orders will be tracked and displayed on this page.
        </p>

        {/* Button */}
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={handleStartShopping}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 sm:px-6 sm:py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-100 shadow-none"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
