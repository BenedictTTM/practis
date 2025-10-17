'use client';
import React, { useState } from 'react';
import { Search, Package, RotateCcw, CreditCard, Shield, Info, Tag, Phone, Mail, MessageSquare, ChevronDown } from 'lucide-react';

const HelpCenter = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      icon: Package,
      title: 'Orders & Shipping',
      description: 'Track your order, shipping details, and more',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      description: 'Learn about our return policy and processes',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: CreditCard,
      title: 'Payments',
      description: 'All your payments related questions answered',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Shield,
      title: 'Account & Security',
      description: 'Manage your account and keep it secure',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Info,
      title: 'Product Information',
      description: 'Find details about our products',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Tag,
      title: 'Promotions & Discounts',
      description: 'Information about our latest promotions',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and clicking "My Orders" section in your account. You\'ll also receive an email with tracking information once your order ships.'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. The item must be unused and in its original packaging. To initiate a return, please visit the "Returns" section in your account or contact our support team.'
    },
    {
      id: 3,
      question: 'How do I change my password?',
      answer: 'You can change your password by going to "Account Settings" and selecting the "Change Password" option. We recommend using a strong password with a combination of letters, numbers, and special characters.'
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Available 9am-5pm',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Mail,
      title: 'Email us',
      description: 'Response within 24 hours',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Available 24/7',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">How can we help?</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">FAQ Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className={`${category.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`${category.color} w-6 h-6`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still Need Help?</h2>
            <p className="text-gray-600">Our support team is here for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg border border-gray-100 hover:border-red-200 transition-colors cursor-pointer"
                >
                  <div className={`${method.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`${method.color} w-6 h-6`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            © 2024 staff. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;