'use client'
import React, { useEffect , useState } from 'react'
import SearchComponent from './searchComponent'
import { IoCartOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";

import NavLinks from '../Navigation/navLinks' // Import your navLinks component
import { PiPlug } from "react-icons/pi";
import SearchComponet from './searchComponent';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { HiMenu, HiX } from "react-icons/hi";


const MainNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.itemCount);
  const fetchItemCount = useCartStore((state) => state.fetchItemCount);

  useEffect(() => {
    fetchItemCount();
  }, [fetchItemCount]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="md:sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center text-xl sm:text-2xl font-bold text-gray-700 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className='text-red-500'>my</span>
            <span className="ml-1">Plug</span>
            <PiPlug className="text-xl sm:text-2xl text-gray-700 ml-1 sm:ml-2" />
          </Link>

          {/* Desktop Search - Hidden on mobile/tablet */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchComponent />
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <NavIcon 
              href="/main/cart" 
              icon={<IoCartOutline className="text-2xl mb-1" />}
              label="Cart"
              badge={itemCount}
            />
            <NavIcon 
              href="/main/help" 
              icon={<IoMdHelpCircleOutline className="text-2xl mb-1" />}
              label="Help"
            />
            <NavIcon 
              href="/accounts/addProducts" 
              icon={<IoPersonCircleSharp className="text-2xl mb-1" />}
              label="Account"
            />
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Cart Icon */}
            <Link 
              href="/main/cart"
              className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
            >
              <IoCartOutline className="text-2xl" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-red-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="text-3xl" />
              ) : (
                <HiMenu className="text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Search - Below navbar on small screens, hidden on desktop */}
        <div className="lg:hidden pb-4 pt-2">
          <SearchComponent />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-700">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-700 hover:text-red-500"
              aria-label="Close menu"
            >
              <HiX className="text-2xl" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex flex-col p-4 space-y-1">
            <MobileNavLink
              href="/main/help"
              icon={<IoMdHelpCircleOutline className="text-xl" />}
              label="Help"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/accounts/addProducts"
              icon={<IoPersonCircleSharp className="text-xl" />}
              label="Account"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop Navigation Icon Component
interface NavIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavIcon = ({ href, icon, label, badge }: NavIconProps) => (
  <Link
    href={href}
    className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors group min-w-[60px]"
  >
    <div className="relative">
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="text-xs sm:text-sm mt-0.5 group-hover:font-medium transition-all">
      {label}
    </span>
  </Link>
);

// Mobile Navigation Link Component
interface MobileNavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MobileNavLink = ({ href, icon, label, onClick }: MobileNavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors"
  >
    {icon}
    <span className="text-base font-medium">{label}</span>
  </Link>
);

export default MainNavBar