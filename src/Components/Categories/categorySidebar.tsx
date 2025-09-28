import React from 'react';
import { motion } from 'framer-motion';
import { MdNavigateNext } from 'react-icons/md';
import { categories } from '../../constants/categories';

export default function CategorySidebar() {
  return (
    <div className="relative w-56 sm:w-64 md:w-72 h-[350px] overflow-hidden">
      {/* Top Blur Overlay */}
      <div className="pointer-events-none absolute top-0 left-0 h-8 w-full bg-gradient-to-b from-white to-transparent z-10"></div>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto py-2 scrollbar-hide">
        {categories.map((cat, idx) => (
          <motion.a
            key={cat}
            href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`}
            whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
            className="flex items-center justify-between px-4 py-3 transition"
            aria-label={cat}
          >
            <span className="text-sm text-gray-800 truncate pr-2">{cat}</span>
            <MdNavigateNext className="text-gray-400 flex-shrink-0" />
          </motion.a>
        ))}
      </div>

      {/* Bottom Blur Overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  );
}