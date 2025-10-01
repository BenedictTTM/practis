'use client';

import { useState } from 'react';
import { User, Mail, MapPin, Globe, Calendar, Phone, Hash, Languages } from 'lucide-react';

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: 'Kristin',
    lastName: 'Watson',
    country: 'Canada',
    city: 'Quebec',
    email: 'vsprintf@hotmail.com',
    dateOfBirth: '1989-06-01',
    taxId: 'Canada',
    phone: '6314139486',
    gender: 'Female',
    language: 'English'
  });

  const [focusedField, setFocusedField] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const countries = ['Canada', 'United States', 'United Kingdom', 'Australia'];
  const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const languages = ['English', 'French', 'Spanish', 'German'];

  return (
    <div className="min-h-screen  p-2 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Personal information</h1>
            <p className="text-gray-500 mt-1">Manage your personal information, including phone numbers and email address where you can be contacted</p>
          </div>

          <div className="p-3">
            {/* Personal Information Section */}
            <div className="mb4-">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'firstName'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'lastName'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    onFocus={() => setFocusedField('dateOfBirth')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'dateOfBirth'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      onFocus={() => setFocusedField('gender')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-900 ${
                        focusedField === 'gender'
                          ? 'border-red-500 bg-white ring-1 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {genders.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-500" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'email'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'phone'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-400" />
                    Preferred Language
                  </label>
                  <div className="relative">
                    <select
                      value={formData.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      onFocus={() => setFocusedField('language')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-900 ${
                        focusedField === 'language'
                          ? 'border-red-500 bg-white ring-1 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    Country
                  </label>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      onFocus={() => setFocusedField('country')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-900 ${
                        focusedField === 'country'
                          ? 'border-red-500 bg-white ring-1 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
                      focusedField === 'city'
                        ? 'border-red-500 bg-white ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Tax Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-red-500" />
                Tax Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Identification Number
                  </label>
                  <div className="relative">
                    <select
                      value={formData.taxId}
                      onChange={(e) => handleChange('taxId', e.target.value)}
                      onFocus={() => setFocusedField('taxId')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-900 ${
                        focusedField === 'taxId'
                          ? 'border-red-500 bg-white ring-1 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => console.log('Cancelled')}
                className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-5 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Your information is securely stored and encrypted
        </p>
      </div>
    </div>
  );
}