'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/lib/auth';
import dynamic from 'next/dynamic';
const PurchaseSlotsModal = dynamic(() => import('@/Components/slots/PurchaseSlotsModal'), { ssr: false });

interface User {
  id: number;
  email: string;
  name?: string;
}

interface SlotsData {
  availableSlots: number;
  usedSlots: number;
  totalSlots: number;
}

// Progress bar component
const ProgressBar = ({ percentage }: { percentage: number }) => {
  const widthPercentage = Math.min(percentage, 100);
  return (
    <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${widthPercentage}%` }}
      />
    </div>
  );
};

export default function SlotsDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [slotsData, setSlotsData] = useState<SlotsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await AuthService.getUser();
      if (userData) {
        setUser(userData);
        return userData;
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError('Failed to load user data');
      return null;
    }
  }, []);

  const fetchSlotsData = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`/api/slots/${userId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`Failed to fetch slots: ${response.status}`);

      const data = await response.json();
      setSlotsData(data);
    } catch (error) {
      console.error('Failed to fetch slots data:', error);
      setError('Failed to load slots data');
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userData = await fetchUser();
        if (userData && userData.id) await fetchSlotsData(userData.id);
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [fetchUser, fetchSlotsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-2.5 w-12 h-12 mx-auto mb-3">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = slotsData?.availableSlots ?? 0;
  const usedSlots = slotsData?.usedSlots ?? 0;
  const totalSlots = availableSlots + usedSlots;
  const usagePercentage = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;

  return (
    <div className="min-h-screen py-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Slots</h1>
          <p className="mt-1 text-sm text-red-900">Manage your inventory capacity efficiently</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Slots Overview */}
            <div className="b rounded-xl border border-gray-50 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Your Product Slots</h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                      You have <span className="font-semibold text-gray-700">{availableSlots}</span> available out of {totalSlots} total.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition-all"
                  >
                    Purchase Slots
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Available', value: availableSlots },
                    { label: 'In Use', value: usedSlots },
                    { label: 'Total', value: totalSlots },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center border border-gray-200"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Slot Usage</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {usedSlots} / {totalSlots} <span className="text-gray-500 font-normal">({usagePercentage}%)</span>
                    </span>
                  </div>
                  <ProgressBar percentage={usagePercentage} />
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">No Recent Activity</p>
                <p className="mt-1 text-sm text-gray-500">Your recent slot purchases will appear here.</p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 sm:p-5 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How Slots Work</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Simple Pricing',
                    text: 'Each slot has a fixed price. Buy as many as you need, whenever you need them.',
                  },
                  {
                    title: 'Reusable & Flexible',
                    text: 'When a product is removed, its slot is freed up and can be reused for another product.',
                  },
                  {
                    title: 'Never Lose a Slot',
                    text: 'Purchased slots are yours forever. They never expire or disappear.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900 mb-1">Need more capacity?</p>
                <p className="text-[11px] text-red-700 mb-2">Scale your business by purchasing additional slots today.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full px-3 py-1.5 rounded-md bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600 transition"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Slots Modal */}
      {user && (
        <PurchaseSlotsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user.id}
          currentSlots={availableSlots}
          onSuccess={async () => {
            // Refetch slots data after successful purchase
            if (user.id) {
              await fetchSlotsData(user.id);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
