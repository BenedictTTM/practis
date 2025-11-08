import React from 'react'
import Link from 'next/link'
import { Plug, Mail, Phone, MapPin } from 'lucide-react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl">
        <div className="py-8 sm:py-10 lg:py-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link 
                href="/"
                className="flex items-center text-2xl font-bold text-gray-700 hover:opacity-80 transition-opacity mb-4"
                aria-label="myPlug Home"
              >
                <h2 className="text-red-500 font-heading">my</h2>
                <span className="ml-1 font-heading">Plug</span>
                <Plug className="text-2xl text-gray-700 ml-2" />
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Connecting you to everything you need. Your trusted marketplace for quality products and seamless shopping.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                <FooterLink href="/" label="Shop" />
                <FooterLink href="/about" label="About Us" />
                <FooterLink href="/main/contact" label="Contact" />
                <FooterLink href="/main/help" label="Help / FAQ" />
              </ul>
            </div>

            {/* Account & Orders */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Account & Orders</h3>
              <ul className="space-y-2.5">
                <FooterLink href="/accounts/addProducts" label="My Account" />
                <FooterLink href="/main/orders" label="My Orders" />
                <FooterLink href="/wishlist" label="Wishlist" />
                <FooterLink href="/track-order" label="Track Order" />
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Support</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:support@myplug.com" 
                    className="flex items-start gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-red-500" />
                    <span>support@myplug.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+1234567890" 
                    className="flex items-start gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors group"
                  >
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-red-500" />
                    <span>+1 (234) 567-890</span>
                  </a>
                </li>
                <li className="pt-1">
                  <FooterLink href="/main/help" label="Help Center" />
                  <FooterLink href="/terms" label="Terms & Conditions" />
                  <FooterLink href="/privacy" label="Privacy Policy" />
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              © {currentYear} myPlug. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 mr-2">We accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-[10px] font-bold">
                  MC
                </div>
                <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[10px] font-bold">
                  AMEX
                </div>
                <div className="w-10 h-6 bg-teal-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                  PAY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Reusable Footer Link Component
interface FooterLinkProps {
  href: string
  label: string
}

const FooterLink = ({ href, label }: FooterLinkProps) => (
  <li>
    <Link 
      href={href}
      className="text-sm text-gray-600 hover:text-red-500 transition-colors inline-block"
    >
      {label}
    </Link>
  </li>
)

export default Footer