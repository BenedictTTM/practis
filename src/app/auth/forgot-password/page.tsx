'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/lib/auth';
import { SubmitButton } from '@/Components/AuthSubmitButton/SubmitButton';
import { FormInput } from '@/Components/FormInput/fromInput';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import CartImage from '../../../../public/CartImage2.png';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (values: FormValues) => {
    setMessage(null);

    try {
      await AuthService.requestPasswordReset(values);
      setMessage({
        type: 'success',
        text: 'If that email is registered, you will receive a password reset link shortly.',
      });
      reset();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Unable to send password reset email.';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side Image */}
      <div className="hidden md:flex md:w-1/2">
        <Image
          src={CartImage}
          alt="Password reset visual"
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12 md:py-0">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>

          {/* Card Container */}
          <div className="bg-white p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-red-600">
                <Mail className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Forgot Password</h1>
              <p className="text-sm text-red-900 leading-relaxed">
                Enter your email address below and we’ll send you a link to reset your password.
              </p>
            </div>

            {/* Message Alert */}
            {message && (
              <div
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                type="email"
                placeholder="Enter your email address"
                register={register('email')}
                error={errors.email?.message}
              />
              <SubmitButton isSubmitting={isSubmitting} loadingText="Sending reset link...">
                Send reset link
              </SubmitButton>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-red-500 hover:text-red-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
