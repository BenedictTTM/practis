'use client';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNavigateNext, MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import {
  useCategories,
  ProductCategory,
  getCategoryLabel,
} from '@/app/api/products/categories/client';


export default function CategorySidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { categories, loading, error } = useCategories();

  // Normalize API payload into the shape used by the sidebar
  const displayCategories = useMemo(() => {
    console.log('📊 [CategorySidebar] Categories data:', { categories, loading, error });
    if (categories && categories.length > 0) {
      const mapped = categories.map((c) => ({
        slug: c.category as ProductCategory,
        label: c.label || getCategoryLabel(c.category as ProductCategory),
      }));
      console.log('✅ [CategorySidebar] Using API categories:', mapped);
      return mapped;
    }
    console.log('⚠️  [CategorySidebar] Using fallback categories');
    return FALLBACK_CATEGORIES;
  }, [categories, loading, error]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle categories menu"
      >
        {isMobileMenuOpen ? (
          <MdClose className="text-2xl" />
        ) : (
          <MdMenu className="text-2xl" />
        )}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:translate-x-0 fixed lg:relative lg:block w-64 sm:w-72 lg:w-56 xl:w-64 h-full lg:h-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none z-40 lg:z-auto"
      >
        <div className="relative w-full h-screen lg:h-[400px] xl:h-[450px] overflow-hidden bg-white rounded-none lg:rounded-lg lg:border lg:border-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900"
              aria-label="Close menu"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* Top Blur Overlay */}
          <div className="pointer-events-none absolute top-0 lg:top-0 left-0 h-12 lg:h-8 w-full bg-gradient-to-b from-white to-transparent z-10"></div>

          {/* Scrollable Content */}
          <div className="h-[calc(100vh-64px)] lg:h-full overflow-y-auto py-2 scrollbar-hide">
            <nav aria-label="Product categories">
              {/* Loading skeletons */}
              {loading && displayCategories.length === 0 && (
                <div className="px-4 py-2 space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              )}

              {/* Render categories even while loading if we have fallback data */}
              {displayCategories.map((cat) => (
                <CategoryLink
                  key={cat.slug}
                  slug={cat.slug}
                  label={cat.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
              
              {/* Error state */}
              {error && !loading && categories.length === 0 && (
                <div className="px-4 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Blur Overlay */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-12 lg:h-8 w-full bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>
      </motion.aside>
    </>
  );
}

// Reusable Category Link Component
interface CategoryLinkProps {
  slug: string;
  label: string;
  onClick: () => void;
}

function CategoryLink({ slug, label, onClick }: CategoryLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    console.log('🔗 [CategoryLink] Clicked:', { slug, label, href: `/main/products/categories?category=${slug}` });
    onClick();
  };

  return (
    <Link
      href={`/main/products/categories?category=${slug}`}
      onClick={handleClick}
      className="block"
    >
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between px-4 py-3 lg:py-2.5 transition-colors group cursor-pointer"
        role="link"
        aria-label={`View ${label} category`}
      >
        <span className="text-sm lg:text-xs xl:text-sm text-gray-800 font-medium truncate pr-2 group-hover:text-black">
          {label}
        </span>
        <MdNavigateNext className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 text-lg lg:text-base transition-colors" />
      </motion.div>
    </Link>
  );
}