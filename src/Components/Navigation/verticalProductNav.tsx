'use client';

import Link from 'next/link';
import { LayoutGrid, User, ShoppingCart, Settings, LogOut } from 'lucide-react';

export default function VerticalNavigation() {
  const items = [
    { href: '/accounts', label: 'Dashboard', icon: LayoutGrid },
    { href: '/accounts/profile', label: 'Profile', icon: User },
    { href: '/accounts/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/accounts/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full p-6">
      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#E43C3C]"
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#E43C3C]">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
