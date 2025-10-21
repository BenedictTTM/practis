
'use client'
import { useState, useEffect } from 'react';
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
  Menu,
  Plus,
  Grid3x3,
  User,
} from 'lucide-react';
import { PiPlug } from 'react-icons/pi';
import Link from "next/link";
import { userService } from '@/services/userService';

export default function Sidebar() {
  const router = useRouter();
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Product Grid');
  const [userProfile, setUserProfile] = useState<{
    firstName?: string;
    lastName?: string;
    profilePic?: string | null;
  } | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        return;
      }

      const authData = await authResponse.json();
      const currentUserId = authData.user?.id || authData.id;

      if (currentUserId) {
        const profile = await userService.getUserProfile(currentUserId);
        setUserProfile({
          firstName: profile.firstName,
          lastName: profile.lastName,
          profilePic: profile.profilePic,
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const getUserInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getUserFullName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return 'User';
  };

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/accounts' },
    {
      icon: Tag,
      label: 'Products',
      path: '/products',
      hasSubmenu: true,
      submenu: [
        { icon: Plus, label: 'Add Product', path: '/accounts/addProducts' },
        { icon: Grid3x3, label: 'Product Grid', path: '/accounts/grid' },
      ]
    },
    { icon: Users, label: 'Customers', path: '/accounts/customers' },
    { icon: Activity, label: 'Analytics', path: '/accounts/analytics' },
    { icon: Bell, label: 'Notifications', path: '/accounts/notifications' },
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Logo/Brand - fixed at top */}
      <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200">
        <Link href="/main/products" className="flex items-center text-xl font-bold text-gray-800">
          <span className='text-red-600'>my</span>
          <span className="text-gray-800">Plug</span>
        </Link>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-2  border-gray-200">
        <div className="flex items-center gap-3">
          {userProfile?.profilePic ? (
            <img
              src={userProfile.profilePic}
              alt={getUserFullName()}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200">
              {getUserInitials()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {getUserFullName()}
            </h3>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation - scrollable middle section */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 scrollbar-hide bg-gray-50">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setIsProductsOpen(!isProductsOpen);
                } else {
                  setActiveItem(item.label);
                  router.push(item.path);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeItem === item.label && !item.hasSubmenu
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${
                  activeItem === item.label && !item.hasSubmenu ? 'text-red-600' : 'text-gray-600'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  isProductsOpen ? '' : '-rotate-90'
                }`} />
              )}
            </button>

            {item.hasSubmenu && isProductsOpen && (
              <div className="mt-1 ml-3 space-y-1">
                {item.submenu.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => {
                      setActiveItem(subItem.label);
                      router.push(subItem.path);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                      activeItem === subItem.label
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    <subItem.icon className={`w-4 h-4 ${
                      activeItem === subItem.label ? 'text-red-600' : 'text-gray-500'
                    }`} />
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings and Logout - fixed at bottom */}
      <div className="px-3 py-4 bg-gray-50 border-t border-gray-200 space-y-1">
        <button
          onClick={() => {
            setActiveItem('Settings');
            router.push('/accounts/settings');
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            activeItem === 'Settings'
              ? 'bg-red-50 text-red-600'
              : 'text-gray-700 hover:bg-white hover:shadow-sm'
          }`}
        >
          <Settings className={`w-5 h-5 ${
            activeItem === 'Settings' ? 'text-red-600' : 'text-gray-600'
          }`} />
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}