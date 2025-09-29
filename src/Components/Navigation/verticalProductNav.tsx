'use client'
import { useState } from 'react';
import { LayoutGrid, Tag, Users, ShoppingCart, Activity, Bell, Settings, ChevronDown, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Product Grid');

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
    {
      icon: Tag,
      label: 'Products',
      path: '/products',
      hasSubmenu: true,
      submenu: [
        { label: 'Product List', path: '/products/list' },
        { label: 'Product Grid', path: '/products/grid' },
        { label: 'Categories', path: '/products/categories' },
        { label: 'Product Details', path: '/products/details' }
      ]
    },
    { icon: Tag, label: 'Flash Sales', path: '/flash-sales' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingCart, label: 'Order List', path: '/orders' },
    { icon: Activity, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200">
      <nav className="py-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setIsProductsOpen(!isProductsOpen);
                } else {
                  setActiveItem(item.label);
                }
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors ${
                activeItem === item.label && !item.hasSubmenu ? 'text-gray-900' : ''
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
                    onClick={() => setActiveItem(subItem.label)}
                    className={`w-full text-left px-6 pl-14 py-2.5 text-sm transition-colors ${
                      activeItem === subItem.label
                        ? 'text-purple-600 bg-purple-50 font-medium'
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
    </div>
  );
}