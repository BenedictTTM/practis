import Link from "next/link";

interface CheckoutHeaderProps {
  title?: string;
  backHref?: string;
  className?: string;
}

export default function CheckoutHeader({
  title = "Checkout",
  backHref = "/main/cart",
  className = "",
}: CheckoutHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-2 sm:mb-3 md:mb-4 ${className}`}>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
      <Link href={backHref} className="text-red-900 hover:text-gray-700 text-[11px] sm:text-xs md:text-sm">
        ← Back to Cart
      </Link>
    </div>
  );
}
