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
    <div>
      <h1>Welcome, {user.firstName ?? user.email}</h1>
      <p>User id: {user.id}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
