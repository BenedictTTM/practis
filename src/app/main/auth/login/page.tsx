'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/Components/Toast/toast';
import { SubmitButton } from '@/Components/AuthSubmitButton/SubmitButton';
import SignInWithGoogle from '../../../../Components/AuthSubmitButton/signInWithGoogle';
import { FormInput } from '@/Components/FormInput/fromInput';
import CartImage from '../../../../../public/CartImage.png';
import Image from 'next/image';

// Fixed Zod validation schema for LOGIN (only email and password)
const LogInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LogInData = z.infer<typeof LogInSchema>;

// Main LogIn Component
export default function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LogInData>({
    resolver: zodResolver(LogInSchema),
  });

  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const onSubmit = async (data: LogInData) => {
    console.log('🎉 Login form submitted!', data);
    
    try {
      const response = await AuthService.login(data);
      console.log('✅ Login response:', response);

      showSuccess('Logged in successfully!', {
        description: 'Welcome back to our platform',
        action: {
          label: 'Get Started',
          onClick: () => {
            router.push('/products');
            console.log('Redirecting to products...'); 
          }
        }
      });
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push('/products');
      }, 2000);

      reset();
    } catch (error) {
      console.error('❌ Login error:', error);
      
      showError('Login failed', {
        description: (error as Error).message || 'Invalid credentials or something went wrong',
        action: {
          label: 'Try Again',
          onClick: () => {
            console.log('Retrying...');
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex w-full">
        {/* Image Section */}
        <div className="flex-1">
          <Image 
            src={CartImage} 
            alt="Cart Image" 
            className="w-full h-screen object-cover py-10" 
          />
        </div>

        {/* Login Form Section */}
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-black mb-4">Log in to Your Account </h1>
              <p className="text-sm text-gray-700">Enter your details below</p>
            </div>
           
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormInput
                type="email"
                placeholder="Email or Phone Number"
                register={register('email')}
                error={errors.email?.message}
              />

              {/* Password Field */}
              <FormInput
                type="password"
                placeholder="Password"
                register={register('password')}
                error={errors.password?.message}
              />

              {/* Submit Button and Forgot Password */}
              <div className="flex-col items-center justify-between space-y-4 pt-2">
                <SubmitButton isSubmitting={isSubmitting} loadingText="Logging in...">
                  Log In
                </SubmitButton>
                <SignInWithGoogle isSubmitting={isSubmitting} />
                <a href="/auth/forgot-password" className="text-sm text-red-500 hover:underline">
                  Forget Password?
                </a>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/auth/signUp" className="font-medium underline text-gray-800">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}