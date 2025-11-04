import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CartHeader() {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
        Your Cart
      </h1>
      <Link
        href="/main/products"
        className="flex items-center gap-1 sm:gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm sm:text-base whitespace-nowrap flex-shrink-0"
      >
        <span className="hidden sm:inline">Continue Shopping</span>
        <span className="sm:hidden">Continue</span>
        <ArrowRight size={18} className="flex-shrink-0" />
      </Link>
    </div>
  );
}