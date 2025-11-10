"use client";

import React from 'react';
import SharedLoading from '@/Components/Loaders/SharedLoading';

export default function CartLoading() {
  return <SharedLoading size={64} color="#E43C3C" message="Loading your cart..." subMessage="Just a moment" />;
}
