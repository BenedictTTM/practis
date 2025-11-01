'use client';

import { useEffect, useState } from 'react';
import { 
  Home, 
  User, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  X,
  Plus,
  Grid3x3,
  Calendar,
  Bell,
  Package,
  ChevronDown
} from 'lucide-react';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { useRouter, usePathname } from 'next/navigation';


interface MobileNavProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: MobileNavProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const { data: profile, isLoading } = useCurrentUserProfile();

  // Map mobile items to the same routes used by the vertical nav
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/accounts', hasSubmenu: false },
    { id: 'profile', label: 'My Profile', icon: User, path: '/accounts/settings', hasSubmenu: false },
    { 
      id: 'myproducts', 
      label: 'My Products', 
      icon: Package, 
      path: null, 
      hasSubmenu: true,
      submenu: [
        { id: 'addproduct', label: 'Add Product', icon: Plus, path: '/accounts/addProducts' },
        { id: 'productgrid', label: 'Product Grid', icon: Grid3x3, path: '/accounts/grid' },
      ]
    },
    { id: 'slotsDashboard', label: 'Slots', icon: Calendar, path: '/accounts/slots-dashboard', hasSubmenu: false },
    { id: 'notifications', label: 'Notification', icon: Bell, path: '/accounts/notifications', hasSubmenu: false },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/accounts/settings', hasSubmenu: false },
  ];

  const initials = (() => {
    if (!profile) return 'AB';
    const f = profile.firstName?.trim() || '';
    const l = profile.lastName?.trim() || '';
    if (f && l) return `${f[0]}${l[0]}`.toUpperCase();
    if (f) return f[0].toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return 'AB';
  })();

  const displayName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.email : 'Guest';

  // ✅ Detect active item by route (prioritize specific account routes)
  useEffect(() => {
    if (!pathname) return;

    if (pathname.includes('/accounts/addProducts')) setActiveItem('addproduct');
    else if (pathname.includes('/accounts/grid')) setActiveItem('productgrid');
    else if (pathname.includes('/accounts/slots-dashboard')) setActiveItem('slotsDashboard');
    else if (pathname.includes('/accounts/notifications')) setActiveItem('notifications');
    else if (pathname.includes('/accounts/settings')) setActiveItem('settings');
    else if (pathname.includes('/main/cart')) setActiveItem('carts');
    else if (pathname.includes('/accounts')) setActiveItem('home');
    else if (pathname.includes('/main/products')) setActiveItem('home');
    else setActiveItem('home');
  }, [pathname]);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'logout') {
      localStorage.removeItem('token');
      router.push('/auth/login');
      onClose?.();
    } else if (item.hasSubmenu) {
      // Toggle submenu
      setOpenSubmenu(!openSubmenu);
    } else if (item.path) {
      setActiveItem(item.id);
      router.push(item.path);
      onClose?.();
    }
  };

  const handleSubmenuClick = (subItem: any) => {
    setActiveItem(subItem.id);
    router.push(subItem.path);
    onClose?.();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      /* ignore */
    }
    router.push('/auth/login');
    onClose?.();
  };

  return (
    <>
      {/* Backdrop: covers the whole screen and applies a blur (clicking it closes the sidebar) */}
      <div
        onClick={() => onClose?.()}
        aria-hidden="true"
        className="fixed inset-0  backdrop-blur-sm transition-opacity duration-200 z-40"
      />

      <div className="fixed left-0 top-0 h-screen w-full max-w-sm bg-white text-gray-800 shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header with improved styling */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {profile?.profilePic ? (
              <img
                src={profile.profilePic}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-red-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 font-medium">Hello,</p>
              <h2 className="font-bold text-base text-gray-900">{isLoading ? 'Loading...' : displayName}</h2>
            </div>
          </div>
          <button
            onClick={() => onClose?.()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6">
          <svg
            className="w-full h-full"
            viewBox="0 0 320 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 12C80 12 80 0 160 0C240 0 240 12 320 12V24H0V12Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Navigation Items with improved design */}
      <nav className="flex-1 p-5 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 ${
                    isActive && !item.hasSubmenu
                      ? 'bg-red-50 text-red-600 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={20} strokeWidth={isActive && !item.hasSubmenu ? 2.5 : 2} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={`text-gray-400 transition-transform duration-200 ${
                        openSubmenu ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu with smooth animation */}
                {item.hasSubmenu && openSubmenu && item.submenu && (
                  <ul className="mt-1 ml-6 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;

                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleSubmenuClick(subItem)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              isSubActive
                                ? 'bg-red-50 text-red-600 font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                            }`}
                          >
                            <SubIcon size={18} strokeWidth={isSubActive ? 2.5 : 2} />
                            <span>{subItem.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with logout placed at the bottom */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>

        <p className="mt-3 text-xs text-gray-400 text-center">
          © 2025 <span className="text-red-500 font-bold">Buddies</span>. All rights reserved.
        </p>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
