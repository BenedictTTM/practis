'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNavigateNext, MdMenu, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { categories } from '../../constants/categories';

export default function CategorySidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              {categories.map((cat) => (
                <CategoryLink
                  key={cat}
                  category={cat}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
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
  category: string;
  onClick: () => void;
}

function CategoryLink({ category, onClick }: CategoryLinkProps) {
  const slug = category.replace(/\s+/g, '-').toLowerCase();

  return (
    <Link
      href={`/category/${slug}`}
      onClick={onClick}
      className="block"
    >
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between px-4 py-3 lg:py-2.5 transition-colors group cursor-pointer"
        role="link"
        aria-label={`View ${category} category`}
      >
        <span className="text-sm lg:text-xs xl:text-sm text-gray-800 font-medium truncate pr-2 group-hover:text-black">
          {category}
        </span>
        <MdNavigateNext className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 text-lg lg:text-base transition-colors" />
      </motion.div>
    </Link>
  );
}