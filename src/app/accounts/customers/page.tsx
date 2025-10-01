'use client';

import { useState } from 'react';
import { Search, Calendar, SlidersHorizontal, Settings, MoreVertical, Package, FileText, Receipt, Users } from 'lucide-react';
import { FcPaid } from "react-icons/fc";

export default function InvoiceDashboard() {
  const [dateRange, setDateRange] = useState('1/1/2023 - 12/31/2023');
  
  const invoices = [
    { id: 1, customer: 'Habib Uahid', invoice: 'F - 012023-68', status: 'Unpaid', totalAmount: 8576, date: 'Jan 15, 2023', avatar: 'HU' },
    { id: 2, customer: 'Hasan Amin', invoice: 'F - 012023-68', status: 'Paid', totalAmount: 7234, date: 'Jan 22, 2023', avatar: 'HA' },
    { id: 3, customer: 'Habib Uahid', invoice: 'F - 012023-68', status: 'Unpaid', totalAmount: 8576, date: 'Feb 03, 2023', avatar: 'HU' },
    { id: 4, customer: 'Hasan Amin', invoice: 'F - 012023-68', status: 'Paid', totalAmount: 7234, date: 'Feb 18, 2023', avatar: 'HA' },
    { id: 5, customer: 'Habib Uahid', invoice: 'F - 012023-68', status: 'Unpaid', totalAmount: 8576, date: 'Mar 05, 2023', avatar: 'HU' },
    { id: 6, customer: 'Hasan Amin', invoice: 'F - 012023-68', status: 'Paid', totalAmount: 7234, date: 'Mar 21, 2023', avatar: 'HA' },
    { id: 7, customer: 'Habib Uahid', invoice: 'F - 012023-68', status: 'Unpaid', totalAmount: 8576, date: 'Apr 10, 2023', avatar: 'HU' },
    { id: 8, customer: 'Hasan Amin', invoice: 'F - 012023-68', status: 'Paid', totalAmount: 7234, date: 'Apr 28, 2023', avatar: 'HA' },
    { id: 9, customer: 'Habib Uahid', invoice: 'F - 012023-68', status: 'Unpaid', totalAmount: 8576, date: 'May 12, 2023', avatar: 'HU' },
  ];

  const avatarColors = ['bg-gray-700', 'bg-gray-600', 'bg-gray-800'];

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* All Customers Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xm hover:shadow-sm
           transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">All Customers</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">HU</div>
                <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">HA</div>
                <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">MK</div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">20</div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xm hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">Orders</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">500</span>
            </div>
          </div>

          {/* Service Requests Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xm hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">Service Requests</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">900</span>
            </div>
          </div>

          {/* Invoices & Payments Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600 font-medium">Invoices & Payments</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">$8,800.00</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">More filters</span>
          </button>
          <button className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {invoices.map((invoice, idx) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${avatarColors[idx % 3]} flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                        {invoice.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{invoice.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.invoice}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">$ {invoice.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}