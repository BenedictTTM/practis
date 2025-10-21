"use client";

import React, { useState } from 'react';
import { User, Calendar, MapPin, Globe, Mail } from 'lucide-react';

export default function PersonalInformation() {
  const [userInfo] = useState({
    name: 'irakli talavadze',
    email: 'ikakodesign@gmail.com',
    school: 'University of Ghana',
  });

  type InfoCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    iconColor?: string;
  };

  const InfoCard = ({ icon: Icon, label, value, iconColor }: InfoCardProps) => (
    <div className="rounded-2xl p-6 shadow-sm hover:shadow-md bg-gray-50 transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-gray-900 font-semibold text-lg">{label}</h3>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className=" p-8  mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userInfo.name}
              </h1>
              <p className="text-gray-500 mb-6">{userInfo.email}</p>
              
              {/* Navigation */}
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-red-600 font-semibold text-lg">
                  Personal information
                </a>
               
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Order History
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white  p-8 ">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Personal information
            </h2>
            <p className="text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={User}
              label="Name"
              value={userInfo.name}
              iconColor="text-red-600"
            />
            
            <InfoCard
              icon={MapPin}
              label="Country Region"
              value={userInfo.school}
              iconColor="text-red-600 "
            />

            <InfoCard
              icon={Mail}
              label="Contactable at"
              value={userInfo.email}
              iconColor="text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}