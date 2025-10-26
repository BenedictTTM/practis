"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Home, User, ShoppingCart, Settings, LogOut, X } from 'lucide-react';
import { useUserProfile } from '@/lib/userProfile';

interface MobileNavProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: MobileNavProps) => {
  const [activeItem, setActiveItem] = useState('home');

  // Fetch session using React Query (so cache / stale handling is consistent)
  const fetchSession = async () => {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  };

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const sessionUserId = session?.user?.id || session?.id;

  const { data: profile, isLoading: isProfileLoading } = useUserProfile(
    sessionUserId ? Number(sessionUserId) : undefined
  );

  const isLoading = isSessionLoading || isProfileLoading;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'carts', label: 'Carts', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const initials = (() => {
    // Only derive initials from the user profile data (do not use session fields)
    if (!profile) return 'AB';
    const f = profile.firstName?.trim() || '';
    const l = profile.lastName?.trim() || '';
    if (f && l) return `${f[0]}${l[0]}`.toUpperCase();
    if (f) return f[0].toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return 'AB';
  })();

  const displayName = (() => {
    // Use profile data only; fallback to email from profile, otherwise 'Guest'
    if (profile) return `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.email;
    return 'Guest';
  })();

  return (
    <div className="h-screen w-80 bg-white text-gray-800 shadow-lg flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {profile?.profilePic ? (
              <img
                src={profile.profilePic}
                alt={displayName}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-[#E43C3C] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {isLoading ? '...' : initials}
              </div>
            )}
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
