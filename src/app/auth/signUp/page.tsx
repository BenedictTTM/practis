'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/lib/auth';
import { PasswordStrengthMeter } from '@/Components/PasswordStrengthMeter/passwordstrengthmeter';
import { useToast } from '@/Components/Toast/toast';
import { SubmitButton } from '@/Components/AuthSubmitButton/SubmitButton';
import { FormInput } from '@/Components/FormInput/fromInput';
import Image from 'next/image';
import CartImage from '../../../../public/CartImage2.png';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data: SignUpData) => {
    try {
      const response = await AuthService.signup(data);
      console.log('✅ Signup successful:', response);

      if (response?.success) {
        showSuccess('Account created successfully!', {
          description: 'Welcome to our platform!',
        });

        setTimeout(() => {
          console.log('🚀 Redirecting to /products...');
          router.push('/main/products');
          reset();
        }, 500);
      } else {
        throw new Error('Signup failed — no success response.');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      showError('Signup failed', {
        description: (error as Error).message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Image Section */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5">
        <Image src={CartImage} alt="Cart" fill className="object-cover" />
      </div>

      {/* Form Section */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 items-center justify-center p-6 sm:p-8 md:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-red-900 mb-2">
              Create an Account
            </h1>
            <p className="text-sm sm:text-base text-red-900">
              Enter your details below
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              placeholder="First Name"
              register={register('firstName')}
              error={errors.firstName?.message}
            />
            <FormInput
              placeholder="Last Name"
              register={register('lastName')}
              error={errors.lastName?.message}
            />
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
            >
              <PasswordStrengthMeter password={password} />
            </FormInput>

            <SubmitButton isSubmitting={isSubmitting} loadingText="Creating account...">
              Create Account
            </SubmitButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-medium text-blue-700 hover:underline hover:text-blue-600"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Image */}
      <div className="relative w-full h-48 mt-4 md:hidden">
        <Image src={CartImage} alt="Cart" fill className="object-cover rounded-t-lg" />
      </div>
    </div>
  );
}
