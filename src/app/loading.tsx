"use client";

import React from 'react';
import DotLoader from '@/Components/Loaders/DotLoader';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DotLoader size={64} ariaLabel="Loading application" />
    </div>
  );
};

export default Loading;