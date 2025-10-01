
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Tag,
  Users,
  ShoppingCart,
  Activity,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { PiPlug } from 'react-icons/pi';
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Product Grid');

  const menuItems = [
    { icon: LayoutGrid, label: 'Profile', path: '/accounts' },
    {
      icon: Tag,
      label: 'Products',
      path: '/products',
      hasSubmenu: true,
      submenu: [
        { label: 'Add Product ', path: '/accounts/addProducts' },
        { label: 'Product Grid', path: '/accounts/grid' },
      ]
    },
    { icon: Users, label: 'Customers', path: '/accounts/customers' },
    { icon: Activity, label: 'Analytics', path: '/accounts/analytics' },
    { icon: Bell, label: 'Notifications', path: '/accounts/notifications' },
    { icon: Settings, label: 'Settings', path: '/accounts/settings' }
  ];
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    router.push('/auth/login');
  };

  return (
    <div className="h-full flex flex-col ">
      {/* Logo/Brand - fixed at top */}
      <Link href="/">
        <div className="flex items-center text-2xl font-bold text-gray-700 p-5 border-b border-gray-100">
          <span className='text-red-500'>my </span> Plug
          <PiPlug className="text-2xl text-gray-700 ml-2" />
        </div>
      </Link>

      {/* Navigation - scrollable middle section */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setIsProductsOpen(!isProductsOpen);
                } else {
                  setActiveItem(item.label);
                  router.push(item.path);
                }
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-gray-600 hover:text-red-950 hover:bg-gray-50 transition-colors ${
                activeItem === item.label && !item.hasSubmenu ? 'text-red-900' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.hasSubmenu && (
                isProductsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {item.hasSubmenu && isProductsOpen && (
              <div className="bg-gray-50">
                {item.submenu.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => {
                      setActiveItem(subItem.label);
                      router.push(subItem.path);
                    }}
                    className={`w-full text-left px-6 pl-14 py-2.5 text-sm transition-colors ${
                      activeItem === subItem.label
                        ? 'text-red-600 bg-red-50 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout button - fixed at bottom */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}