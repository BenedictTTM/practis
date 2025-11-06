'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { IoCartOutline, IoPersonCircleSharp } from 'react-icons/io5'
import { IoMdHelpCircleOutline } from 'react-icons/io'
import { HiMenu, HiX } from 'react-icons/hi'
import { Plug, LogOut, User, Package, Mail, Heart, Ticket } from 'lucide-react'

import SearchComponent from './searchComponent'
import Sidebar from '../Navigation/mobileNav'
import { useCartStore } from '@/store/cartStore'
import { AuthService } from '@/lib/auth'


const MainNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false)
  const itemCount = useCartStore((state) => state.itemCount)
  const fetchItemCount = useCartStore((state) => state.fetchItemCount)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const helpDropdownRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const toggleAccountDropdown = useCallback(() => {
    setIsAccountDropdownOpen((prev) => !prev)
    setIsHelpDropdownOpen(false)
  }, [])

  const closeAccountDropdown = useCallback(() => {
    setIsAccountDropdownOpen(false)
  }, [])

  const toggleHelpDropdown = useCallback(() => {
    setIsHelpDropdownOpen((prev) => !prev)
    setIsAccountDropdownOpen(false)
  }, [])

  const closeHelpDropdown = useCallback(() => {
    setIsHelpDropdownOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  useEffect(() => {
    fetchItemCount()
  }, [fetchItemCount])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        closeAccountDropdown()
      }
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target as Node)) {
        closeHelpDropdown()
      }
    }

    if (isAccountDropdownOpen || isHelpDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAccountDropdownOpen, isHelpDropdownOpen, closeAccountDropdown, closeHelpDropdown])

  const menuButtonClass = 'p-1.5 sm:p-2 text-gray-700 hover:text-red-500 active:text-red-600 transition-colors touch-manipulation'

  return (
    <nav className="md:sticky bg-gray-50 top-0 z-50   ">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          <Link 
            href="/"
            className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-gray-700 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="myPlug Home"
          >
            <h1 className="text-red-500 font-heading">my</h1>
            <span className="ml-0.5 sm:ml-1 font-heading">Plug</span>
            <Plug className="text-lg sm:text-xl md:text-2xl text-gray-700 ml-1 sm:ml-2" />
          </Link>

          <div className=" top-0 hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8">
            <SearchComponent />
          </div>

          <div className="hidden md:flex items-center md:gap-3 lg:gap-6">
            <Link 
              href="/main/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <div className="relative">
                <IoCartOutline className="text-xl lg:text-2xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-sm lg:text-base font-medium">Cart</span>
            </Link>

            <div className="relative" ref={helpDropdownRef}>
              <button
                onClick={toggleHelpDropdown}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                aria-label="Help Menu"
              >
                <IoMdHelpCircleOutline className="text-xl lg:text-2xl" />
                <span className="text-sm lg:text-base font-medium">Help</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isHelpDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isHelpDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <DropdownItem
                    href="/main/help"
                    icon={<IoMdHelpCircleOutline className="w-4 h-4" />}
                    label="FAQ"
                    onClick={closeHelpDropdown}
                  />
                  <DropdownItem
                    href="/main/contact"
                    icon={<Mail className="w-4 h-4" />}
                    label="Contact Us"
                    onClick={closeHelpDropdown}
                  />
              
                </div>
              )}
            </div>

            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                aria-label="Account Menu"
              >
                <IoPersonCircleSharp className="text-xl lg:text-2xl" />
                
                <span className="text-sm lg:text-base font-medium">{} </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <DropdownItem
                    href="/accounts/addProducts"
                    icon={<User className="w-4 h-4" />}
                    label="My Account"
                    onClick={closeAccountDropdown}
                  />
                  <DropdownItem
                    href="/main/orders"
                    icon={<Package className="w-4 h-4" />}
                    label="Orders"
                    onClick={closeAccountDropdown}
                  />
                  <DropdownItem
                    href="/accounts/inbox"
                    icon={<Mail className="w-4 h-4" />}
                    label="Inbox"
                    onClick={closeAccountDropdown}
                  />
               
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      handleLogout()
                      closeAccountDropdown()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-500 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2 sm:gap-3">
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

        <div className=" md:hidden pb-3 sm:pb-4 pt-2">
          <SearchComponent />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

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

interface DropdownItemProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const DropdownItem = ({ href, icon, label, onClick }: DropdownItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </Link>
)

export default MainNavBar

