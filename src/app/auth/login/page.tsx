'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/lib/auth';
import { mergeAnonymousCart, hasLocalCartItems } from '@/lib/cartMerge';
import { useToast } from '@/Components/Toast/toast';
import { SubmitButton } from '@/Components/AuthSubmitButton/SubmitButton';
import { GoogleSignInButton } from '@/Components/AuthSubmitButton/signInWithGoogle';
import { FormInput } from '@/Components/FormInput/fromInput';
import Image from 'next/image';
import CartImage from '../../../../public/CartImage2.png';

// ✅ Validation schema
const LogInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LogInData = z.infer<typeof LogInSchema>;

export default function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LogInData>({
    resolver: zodResolver(LogInSchema),
  });

  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState<string>('/main/products');
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    const checkout = searchParams.get('checkout');
    
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
    
    if (checkout === 'true') {
      setIsCheckout(true);
    }
  }, [searchParams]);

  const onSubmit = async (data: LogInData) => {
    try {
      const response = await AuthService.login(data);
      console.log('✅ Login response:', response);

      // Check if user had items in local cart before login
      const hadLocalCart = hasLocalCartItems();

      // Merge anonymous cart if exists
      if (hadLocalCart) {
        const mergeResult = await mergeAnonymousCart();
        
        if (mergeResult.success && mergeResult.itemCount! > 0) {
          showSuccess('Logged in successfully!', {
            description: `Welcome back! ${mergeResult.message}`,
          });
        } else {
          showSuccess('Logged in successfully!', {
            description: 'Welcome back to our platform!',
          });
        }
      } else {
        showSuccess('Logged in successfully!', {
          description: 'Welcome back to our platform!',
        });
      }

      // Redirect to checkout if coming from checkout flow, otherwise use redirect URL
      const finalRedirect = isCheckout ? '/main/checkout' : redirectUrl;

      setTimeout(() => {
        router.push(finalRedirect);
      }, 1500);

      reset();
    } catch (error) {
      console.error('❌ Login error:', error);
      showError('Login failed', {
        description:
          (error as Error).message || 'Invalid credentials or something went wrong',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* 🖼️ Image Section */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5">
        <Image src={CartImage} alt="Cart" fill className="object-cover" />
      </div>

      {/* 🧾 Form Section */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 items-center justify-center p-6 sm:p-8 md:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Log in to Your Account
            </h1>
            <p className="text-sm sm:text-base text-red-900">
              Enter your details below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              type="email"
              placeholder="Email or Phone Number"
              register={register('email')}
              error={errors.email?.message}
            />
            <FormInput
              type="password"
              placeholder="Password"
              register={register('password')}
              error={errors.password?.message}
            />

            <SubmitButton isSubmitting={isSubmitting} loadingText="Logging in...">
              Log In
            </SubmitButton>

            <div className="text-right">
              <a
                href="/auth/forgot-password"
                className="text-sm text-red-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <GoogleSignInButton
            text="Continue with Google"
            variant="outline"
            fullWidth
            onError={(error) => {
              showError('OAuth Error', {
                description: error.message,
              });
            }}
          />

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a
                href="/auth/signUp"
                className="font-medium text-blue-700 hover:underline hover:text-blue-600"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Image */}
      <div className="relative w-full h-48 mt-4 md:hidden">
        <Image
          src={CartImage}
          alt="Cart"
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
    </div>
  );
}
