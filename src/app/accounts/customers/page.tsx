'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Eye,
  Pencil,
  Ban
} from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  lastOrderDate: string;
  avatarUrl?: string | null;
};

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/customers', { credentials: 'include' });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload?.data ?? [];
        setCustomers(rows);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load customers';
        setError(message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.trim().toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  const renderAvatar = (customer: Customer) => {
    if (customer.avatarUrl) {
      return (
        <Image
          src={customer.avatarUrl}
          alt={customer.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }

    const initials = customer.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
        {initials || 'CU'}
      </div>
    );
  };

  return (
    <div className="min-h-screen  px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Customers</h1>
          <p className="mt-2 text-sm text-red-900 sm:text-base">Manage your customer base and their interactions.</p>
        </header>

        <section className="rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                Filter
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                Sort
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#E53935] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#cc2f2b]">
                <Plus className="h-4 w-4" />
                Add Customer
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-[#FFF3F1]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Total Orders</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Last Order Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Loading customers...</td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
                  </tr>
                )}

                {!loading && !error && paginatedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-sm text-gray-500">No customers found</td>
                  </tr>
                )}

                {!loading && !error && paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="transition hover:bg-[#FFF9F7]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(customer)}
                        <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.lastOrderDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-gray-600" aria-label={`View ${customer.name}`}>
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-gray-600" aria-label={`Edit ${customer.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-red-500" aria-label={`Disable ${customer.name}`}>
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCustomers.length)} of {filteredCustomers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <span>{page}</span>
                <span className="text-gray-400">/</span>
                <span>{totalPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}