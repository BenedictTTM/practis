'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { IoCartOutline, IoPersonCircleSharp } from 'react-icons/io5'
import { IoMdHelpCircleOutline } from 'react-icons/io'
import { HiMenu, HiX } from 'react-icons/hi'
import { Plug , LogOut } from 'lucide-react'

import SearchComponent from './searchComponent'
import Sidebar from '../Navigation/mobileNav'
import { useCartStore } from '@/store/cartStore'
import { AuthService } from '@/lib/auth'


const MainNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.itemCount)
  const fetchItemCount = useCartStore((state) => state.fetchItemCount)

  // Memoized toggle handler
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  // Fetch cart count on mount
  useEffect(() => {
    fetchItemCount()
  }, [fetchItemCount])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const menuButtonClass = 'p-1.5 sm:p-2 text-gray-700 hover:text-red-500 active:text-red-600 transition-colors touch-manipulation'

  return (
    <nav className="md:sticky bg-gray-50 top-0 z-50   ">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Logo - Responsive sizing */}
          <Link 
            href="/"
            className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-gray-700 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="myPlug Home"
          >
            <h1 className="text-red-500 font-heading">my</h1>
            <span className="ml-0.5 sm:ml-1 font-heading">Plug</span>
            <Plug className="text-lg sm:text-xl md:text-2xl text-gray-700 ml-1 sm:ml-2" />
           
          </Link>

          {/* Desktop/Tablet Search - Hidden on mobile */}
          <div className=" top-0 hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8">
            <SearchComponent />
          </div>

          {/* Desktop Navigation Icons - Hidden on mobile/small tablet */}
          <div className="hidden md:flex items-center md:gap-2 lg:gap-4">
            <NavIcon 
              href="/main/cart" 
              icon={<IoCartOutline className="text-xl lg:text-2xl" />}
              label="Cart"
              badge={itemCount}
            />
            <NavIcon 
              href="/main/help" 
              icon={<IoMdHelpCircleOutline className="text-xl lg:text-2xl" />}
              label="Help"
            />
              <NavIcon 
              href="/account/addProducts" 
              icon={<IoPersonCircleSharp className="text-xl lg:text-2xl" />}
              label="account"
        
            />
             
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors group relative min-w-[50px]"
              aria-label="Logout"
            >
              <LogOut className="text-xl lg:text-2xl" />
              <span className="absolute top-full mt-1 text-[8px] lg:text-[10px] opacity-0 group-hover:opacity-100 group-hover:font-medium transition-all whitespace-nowrap">
                Logout
              </span>
            </button>
          </div>

          {/* Mobile Actions - Cart & Menu Button */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            {/* Mobile Cart Icon with Badge */}
            <Link 
              href="/main/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-red-500 active:text-red-600 transition-colors touch-manipulation"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <IoCartOutline className="text-xl sm:text-2xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            {isMobileMenuOpen ? (
              <button
                onClick={toggleMobileMenu}
                className={menuButtonClass}
                aria-label="Close menu"
                aria-expanded="true"
                type="button"
              >
                <HiX className="text-2xl sm:text-3xl" />
              </button>
            ) : (
              <button
                onClick={toggleMobileMenu}
                className={menuButtonClass}
                aria-label="Open menu"
                aria-expanded="false"
                type="button"
              >
                <HiMenu className="text-2xl sm:text-3xl" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Small Tablet Search - Below navbar, hidden on desktop */}
        <div className=" md:hidden pb-3 sm:pb-4 pt-2">
          <SearchComponent />
        </div>
      </div>

      {/* Mobile Menu Overlay - Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <Sidebar onClose={closeMobileMenu} />
      </div>
    </nav>
  )
}

// Desktop Navigation Icon Component
interface NavIconProps {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}

const NavIcon = ({ href, icon, label, badge }: NavIconProps) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors group relative"
  >
    <div className="relative">
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="absolute top-full mt-1 text-[8px] lg:text-[10px] opacity-0 group-hover:opacity-100 group-hover:font-medium transition-all whitespace-nowrap">
      {label}
    </span>
  </Link>
)

export default MainNavBar