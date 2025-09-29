'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const search = useSearchParams();
  const token = search?.get('token') ?? '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('Token from URL:', token); // Debug log
    if (!token) setMessage('Invalid or missing token.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setMessage('Missing token.');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setMessage('Password changed. Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      setMessage(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl">Reset password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          className="input"
        />
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Saving...' : 'Set new password'}
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}