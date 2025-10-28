'use client';

import React from 'react';
import { useCurrentUserProfile } from '@/hooks/useProfile';

export default function Page() {
  const { data: user, isLoading, isError } = useCurrentUserProfile();

  React.useEffect(() => {
    console.log('[page.tsx] useCurrentUserProfile:', { user, isLoading, isError });
  }, [user, isLoading, isError]);

  if (isLoading) return <div>Loading user...</div>;
  if (isError) return <div>Error loading user</div>;
  if (!user) return <div>No authenticated user</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome, {user.firstName ?? user.email}</h1>
      <p>User ID: {user.id}</p>
      
      <h2>Slot Information</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Available Slots:</strong> {user.availableSlots ?? 0}</p>
        <p><strong>Used Slots:</strong> {user.usedSlots ?? 0}</p>
        <p><strong>Total Slots:</strong> {(user.availableSlots ?? 0) + (user.usedSlots ?? 0)}</p>
      </div>

      <h3>User Details</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
