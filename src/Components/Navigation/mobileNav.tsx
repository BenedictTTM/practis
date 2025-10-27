'use client';

import { useEffect, useState } from 'react';
import { Home, User, ShoppingCart, Settings, LogOut, X } from 'lucide-react';
import { useCurrentUserProfile } from '@/hooks/useProfile';


interface MobileNavProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: MobileNavProps) => {
  const [activeItem, setActiveItem] = useState('home');

  const { data: profile, isLoading } = useCurrentUserProfile();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'carts', label: 'Carts', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
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

  return (
    <div className="h-screen w-80 bg-white text-gray-800 shadow-lg flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
           
            <div>
              <h2 className="font-semibold text-lg text-gray-900">Hello,</h2>
              <p className="text-sm text-gray-500 truncate max-w-[12rem]">{isLoading ? 'Loading...' : displayName}</p>
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
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#E43C3C] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#E43C3C]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section (optional) */}
      <div className="p-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">
          © 2025 <span className="text-[#E43C3C] font-semibold">Buddies</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
