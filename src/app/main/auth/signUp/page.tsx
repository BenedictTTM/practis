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
import CartImage from '../../../../../public/CartImage.png';
import Image from 'next/image';

// Zod validation schema
const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpData = z.infer<typeof signUpSchema>;

// Main SignUp Component
export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const { showSuccess, showError } = useToast();
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data: SignUpData) => {
    console.log('🎉 Form submitted!', data);

    try {
      const response = await AuthService.signup(data);
      console.log('✅ Signup response:', response);

      showSuccess('Account created successfully!', {
        description: 'Welcome to our platform',
        action: {
          label: 'Get Started',
          onClick: () => {
            console.log('Redirecting to ...');
            // e.g., router.push('/dashboard');
          }
        }
      });
      reset();
    } catch (error) {
      console.error('❌ Signup error:', error);

      showError('Signup failed', {
        description: (error as Error).message || 'Something went wrong',
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

        {/* SignUp Form Section */}
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm px-8">
            <div className="mb-8 ">
              <h1 className="text-3xl font-semibold text-black mb-4">Create an account</h1>
              <p className="text-sm text-gray-700">Enter your details below</p>
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
                Already have account?{' '}
                <a href="/auth/login" className="font-medium underline text-blue-700 hover:text-blue-600 ">
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}