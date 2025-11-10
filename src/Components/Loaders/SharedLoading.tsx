"use client";

import React from 'react';
import DotLoader from '@/Components/Loaders/DotLoader';

interface SharedLoadingProps {
  size?: number;
  color?: string;
  message?: string;
  subMessage?: string;
}

export default function SharedLoading({
  size = 64,
  color = '#E43C3C',
  message = 'Loading…',
  subMessage,
}: SharedLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <DotLoader size={size} color={color} ariaLabel={message} />
        <p className="text-gray-600 mt-6 font-medium">{message}</p>
        {subMessage && <p className="text-gray-500 text-sm mt-2">{subMessage}</p>}
      </div>
    </div>
  );
}
