import React from 'react';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';

export default function ServiceFeatures() {
  const features = [
    {
      icon: Truck,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140'
    },
    {
      icon: Headphones,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support'
    },
    {
      icon: ShieldCheck,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days'
    }
  ];

  return (
    <div className="w-full py-16 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wide text-black">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}