'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PasswordStrengthMeter } from '../../../Components/PasswordStrengthMeter/passwordstrengthmeter';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import CartImage from '../../../../public/CartImage2.png';

function ResetPasswordForm() {
  const search = useSearchParams();
  const token = search?.get('token') ?? '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token. Please request a new password reset link.' });
    }
  }, [token]);

  useEffect(() => {
    if (confirmPassword) setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return setMessage({ type: 'error', text: 'Missing reset token.' });
    if (password !== confirmPassword) return setMessage({ type: 'error', text: 'Passwords do not match.' });
    if (password.length < 8) return setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });

    setLoading(true);
    setMessage(null);

    try {
      const response = await AuthService.resetPassword({ token, newPassword: password });
      setMessage({
        type: 'success',
        text: response?.message || 'Password successfully changed! Redirecting to login...',
      });
      setTimeout(() => router.push('/auth/login'), 800);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'Error resetting password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Image Section */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5">
        <Image src={CartImage} alt="Shopping Cart Illustration" fill className="object-cover" priority />
      </div>

      {/* Form Section */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 justify-center items-center bg-white py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 mr-1" /> Back to login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-sm text-gray-500">
              Enter your new password below to reset your account password.
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  disabled={!token || loading}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  disabled={!token || loading}
                  className={`w-full px-4 py-3 pr-12 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-red-500 focus:border-transparent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !token || !passwordsMatch || !password || !confirmPassword}
              className="w-full px-6 py-3 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-red-500 hover:text-red-600 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile Image Section */}
      <div className="relative w-full h-48 mt-6 md:hidden">
        <Image src={CartImage} alt="Shopping cart illustration" fill className="object-cover rounded-t-lg" />
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
