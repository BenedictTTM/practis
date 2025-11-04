'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import SimpleLoader from '@/Components/Loaders/SimpleLoader';
import { userService, type UpdateProfileDto } from '@/services/userService';
import { useToast } from '@/Components/Toast/toast';

// Dynamic imports for icons (tree-shakeable)
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })), { ssr: false });
const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })), { ssr: false });
const Camera = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Camera })), { ssr: false });
const Store = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Store })), { ssr: false });

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  firstName: string;
  lastName: string;
  storeName: string;
  phone: string;
  email: string;
  username: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const REDIRECT_DELAY = 3000;

const INITIAL_FORM_STATE: FormData = {
  firstName: '',
  lastName: '',
  storeName: '',
  phone: '',
  email: '',
  username: '',
};

// ============================================================================
// MEMOIZED COMPONENTS
// ============================================================================

interface ProfileAvatarProps {
  profilePic: string | null;
  username: string;
  uploading: boolean;
  onUploadClick: () => void;
}

const ProfileAvatar = memo(({ profilePic, username, uploading, onUploadClick }: ProfileAvatarProps) => (
  <div className="flex-shrink-0">
    <div className="relative group">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-md">
        {profilePic ? (
          <img
            src={profilePic}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <User className="w-12 h-12 text-gray-400" aria-hidden="true" />
        )}
      </div>

      <button
        onClick={onUploadClick}
        disabled={uploading}
        className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Change profile picture"
        type="button"
      >
        {uploading ? (
          <SimpleLoader size={18} ariaLabel="Uploading" />
        ) : (
          <Camera className="w-6 h-6 text-white" aria-hidden="true" />
        )}
      </button>
    </div>

    <p className="text-sm text-gray-600 text-center mt-3 font-medium">
      @{username || 'username'}
    </p>
  </div>
));

ProfileAvatar.displayName = 'ProfileAvatar';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  type?: string;
  required?: boolean;
}

const FormField = memo(({ label, value, onChange, placeholder, disabled, type = 'text', required }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full px-4 py-2.5 border rounded-lg transition-all ${
        disabled
          ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
      }`}
    />
  </div>
));

FormField.displayName = 'FormField';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfileSettings() {
  // State management
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedRef = useRef(false);
  const { showSuccess, showError } = useToast();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  }, []);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        throw new Error('Please log in to view your profile');
      }

      const authData = await authResponse.json();
      const currentUserId = authData.user?.id || authData.id;

      if (!currentUserId) {
        console.error('Auth response:', authData);
        throw new Error('User ID not found. Please log in again.');
      }

      setUserId(currentUserId);

      const profile = await userService.getUserProfile(currentUserId);
      
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        storeName: profile.storeName || '',
        phone: profile.phone || '',
        email: profile.email || '',
        username: profile.username || '',
      });

      setProfilePic(profile.profilePic || null);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      const errorMessage = err.message || 'Failed to load profile';
      showError(`${errorMessage}. Please make sure you are logged in.`);

      // Redirect to login for auth errors
      if (errorMessage.includes('log in')) {
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, REDIRECT_DELAY);
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - showError is stable from useToast

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const handleStoreNameChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, storeName: value }));
  }, []);

  const handleStoreNameUpdate = useCallback(async () => {
    if (!userId) {
      showError('User ID not found. Please log in again.');
      return;
    }

    try {
      setSaving(true);

      const profileData: UpdateProfileDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        storeName: formData.storeName.trim() || undefined,
      };

      const response = await userService.updateProfile(userId, profileData);
      
      if (response.success) {
        showSuccess('Store name updated successfully! 🎉');
        // Reload profile after update
        const profile = await userService.getUserProfile(userId);
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          storeName: profile.storeName || '',
          phone: profile.phone || '',
          email: profile.email || '',
          username: profile.username || '',
        });
      }
    } catch (err: any) {
      console.error('Error updating store name:', err);
      showError(err.message || 'Failed to update store name');
    } finally {
      setSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, formData.firstName, formData.lastName, formData.storeName]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setUploading(true);

      const response = await userService.uploadProfilePicture(userId, file);
      const uploadedImageUrl =
        (response as any).imageUrl ||
        response.data?.profilePic ||
        response.user?.profilePic;

      if (uploadedImageUrl) {
        setProfilePic(uploadedImageUrl);
        showSuccess('Profile picture updated successfully! 🎉');
      }
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      showError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, validateFile]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadUserProfile();
  }, [loadUserProfile]);

  // ============================================================================
  // RENDER LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SimpleLoader size={48} ariaLabel="Loading profile" />
          <p className="text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen py-2 ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-red-900">
            View your profile information and update your profile picture.
          </p>
        </header>

        {/* Main Form */}
        <div className=" overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Personal Information Section */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Profile Picture */}
                <ProfileAvatar
                  profilePic={profilePic}
                  username={formData.username}
                  uploading={uploading}
                  onUploadClick={triggerFileInput}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload profile picture"
                />

                {/* Form Fields - NOW READ-ONLY */}
                <div className="flex-1 w-full space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      label="First Name"
                      value={formData.firstName}
                      onChange={() => {}}
                      placeholder="Not set"
                      disabled
                    />

                    <FormField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={() => {}}
                      placeholder="Not set"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Details Section */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Email Address"
                  value={formData.email}
                  onChange={() => {}}
                  placeholder="jane.doe@example.com"
                  type="email"
                  disabled
                />

                <FormField
                  label="Phone Number"
                  value={formData.phone || ''}
                  onChange={() => {}}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  disabled
                />
              </div>
            </section>

            {/* Store Information Section - EDITABLE */}
            <section className="mb-8 shadow-sm p-6 md:p-8 rounded-md">
              <div className="flex items-center gap-2 mb-6">
                <Store className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Store Information
                </h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Store Name (Optional)"
                  value={formData.storeName}
                  onChange={handleStoreNameChange}
                  placeholder="e.g. Jane's Emporium"
                  disabled={saving || uploading}
                />

                <button
                  type="button"
                  onClick={handleStoreNameUpdate}
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  {saving ? (
                    <>
                      <SimpleLoader size={14} />
                      Saving...
                    </>
                  ) : (
                    'Update Store Name'
                  )}
                </button>
              </div>
            </section>

       
           
          </div>
        </div>

        {/* Footer Note */}
        <footer className="text-center text-sm text-gray-500 mt-6">
          Your information is securely stored and protected.
        </footer>
      </div>
    </div>
  );

}
