'use client';

import { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Upload,
  Loader2,
  Camera,
  CheckCircle,
  XCircle,
  Store,
} from 'lucide-react';
import {
  userService,
  type UserProfile,
  type UpdateProfileDto,
} from '@/services/userService';

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    phone: '',
    email: '',
    username: '',
  });

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        throw new Error('Please log in to view your profile');
      }

      const authData = await authResponse.json();
      
      // Try multiple ways to get user ID
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
      setError(`${errorMessage}. Please make sure you are logged in.`);
      
      // Redirect to login after 3 seconds if auth error
      if (errorMessage.includes('log in')) {
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (!userId) return setError('User ID not found. Please log in again.');

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const profileData: UpdateProfileDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        storeName: formData.storeName.trim() || undefined,
      };

      const response = await userService.updateProfile(userId, profileData);
      if (response.success) {
        setSuccess('Profile updated successfully! 🎉');
        await loadUserProfile();
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await userService.uploadProfilePicture(userId, file);
      if (response.imageUrl) {
        setProfilePic(response.imageUrl);
        setSuccess('Profile picture updated successfully! 🎉');
      }
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      setError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Alert Messages */}
        {(success || error) && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top ${
              success
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {success ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium">{success || error}</p>
            <button
              onClick={() => {
                setSuccess(null);
                setError(null);
              }}
              className="text-current hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your personal information and profile picture.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Personal Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-md">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {/* Hover overlay */}
                    <button
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                    >
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Username display below avatar */}
                  <p className="text-sm text-gray-600 text-center mt-3 font-medium">
                    {formData.username || 'Username'}
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="flex-1 w-full space-y-5">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Jane"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder="jane.doe@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    disabled
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Store Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Store className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Store Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  placeholder="e.g. Jane's Emporium"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={loadUserProfile}
                disabled={saving || uploading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || uploading || !formData.firstName.trim() || !formData.lastName.trim()}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is securely stored and protected.
        </p>
      </div>
    </div>
  );
}
