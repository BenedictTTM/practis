'use client';

import { useState } from 'react';
import { Plus, SlidersHorizontal, Grid3x3, LayoutGrid, Printer, Edit2, Trash2 } from 'lucide-react';

export default function ProductList() {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const products = [
    { id: '#280101', name: 'Dell XPS 15', icon: '💻', category: 'Laptop & PC', performance: 'Excellent', conversion: '75%', marketing: 'Google Ads', price: '$1,799', sales: 45, status: 'Sold Out', statusColor: 'text-red-600 bg-red-50' },
    { id: '#280102', name: 'Apple iPad (Gen 10)', icon: '📱', category: 'Smartphone', performance: 'Very Good', conversion: '60%', marketing: 'Facebook Ads', price: '$449', sales: 81, status: 'Low Stock', statusColor: 'text-yellow-600 bg-yellow-50' },
    { id: '#280103', name: 'Samsung Galaxy S23', icon: '📱', category: 'Smartphone', performance: 'Good', conversion: '80%', marketing: 'Instagram Ads', price: '$999', sales: 120, status: 'Low Stock', statusColor: 'text-yellow-600 bg-yellow-50' },
    { id: '#280104', name: 'Logitech MX Master 3S', icon: '🖱️', category: 'Accessories', performance: 'Excellent', conversion: '40%', marketing: 'Email Campaign', price: '$99', sales: 200, status: 'In Stock', statusColor: 'text-green-600 bg-green-50' },
    { id: '#280105', name: 'Asus ROG Gaming PC', icon: '🖥️', category: 'Laptop & PC', performance: 'Good', conversion: '55%', marketing: 'YouTube Ads', price: '$2,999', sales: 30, status: 'In Stock', statusColor: 'text-green-600 bg-green-50' },
    { id: '#280106', name: 'ASUS Zenfone 10', icon: '📱', category: 'Smartphone', performance: 'Very Good', conversion: '70%', marketing: 'Google Ads', price: '$799', sales: 75, status: 'In Stock', statusColor: 'text-green-600 bg-green-50' },
    { id: '#280107', name: 'AirPods Pro (2nd Gen)', icon: '🎧', category: 'Accessories', performance: 'Excellent', conversion: '65%', marketing: 'Facebook Ads', price: '$249', sales: 95, status: 'Sold Out', statusColor: 'text-red-600 bg-red-50' },
    { id: '#280108', name: 'Razer Kraken Headset', icon: '🎧', category: 'Accessories', performance: 'Good', conversion: '30%', marketing: 'Twitter Ads', price: '$99', sales: 190, status: 'In Stock', statusColor: 'text-green-600 bg-green-50' },
    { id: '#280103', name: 'Apple iPhone 13', icon: '📱', category: 'Smartphone', performance: 'Very Good', conversion: '85%', marketing: 'Instagram Ads', price: '$799', sales: 140, status: 'Low Stock', statusColor: 'text-yellow-600 bg-yellow-50' },
  ];

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track stock levels, availability, and restocking needs in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Linked Marketing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.performance}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.conversion}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.marketing}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}