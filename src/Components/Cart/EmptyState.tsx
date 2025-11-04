import { ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function EmptyCartState() {
  return (
    <div className=" p-4 sm:p-8 md:p-12 text-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {/* Icon with red background */}
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6">
        <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-500" strokeWidth={1.5} />
      </div>
      
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
        Your Shopping Cart is Empty
      </h2>
      
      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-6 sm:mb-8 max-w-[280px] sm:max-w-sm mx-auto px-2">
        Looks like you haven&apos;t added anything yet. Let&apos;s find something you&apos;ll love!
      </p>
      
      {/* Continue Shopping Button */}
      <Link
        href="/main/products"
        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base w-full sm:w-auto"
      >
        Continue Shopping
      </Link>
      
      {/* Sign in link */}
      <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 px-2">
        Have an account?{' '}
        <Link href="/auth/login" className="text-red-600 hover:underline font-medium">
          Sign in to see your saved items
        </Link>
      </p>
    </div>
  );
}
