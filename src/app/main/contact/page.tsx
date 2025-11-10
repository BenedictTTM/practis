"use client";

import { useState } from "react";
import { MessageCircle, Phone, Copy, Check } from 'lucide-react';

// Phone constants (could be moved to env or config later)
const PHONE_NUMBER = "0274847107"; // Display number provided
const COUNTRY_CODE = "233"; // Assumed Ghana; adjust if different.

const normalizeWhatsAppNumber = (input: string): string => {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return digits;
  // If number starts with 0, replace with country code
  if (digits.startsWith("0")) return COUNTRY_CODE + digits.slice(1);
  // If already starts with country code, keep it
  if (digits.startsWith(COUNTRY_CODE)) return digits;
  // Fallback: return as-is
  return digits;
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copyState, setCopyState] = useState<'idle'|'copied'>("idle");

  const isValid = name.trim() && email.trim() && message.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // Placeholder submit logic (could integrate with API / form service)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(PHONE_NUMBER).then(() => {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-12 ">
      {/* Header */}
      <header className="text-center mb-10 px-2 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">Get in Touch</h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
          Have a question or a project in mind? Reach out!
        </p>
      </header>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full max-w-6xl px-2">
        {/* LEFT: Contact Options */}
        <div className="flex flex-col gap-6">
          {/* WhatsApp Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:p-10 hover:shadow-xs transition-shadow duration-200 flex flex-col items-center text-center w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <MessageCircle className="w-6 sm:w-9 h-6 sm:h-9 text-red-500" aria-hidden="true" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900">Chat on WhatsApp</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-full sm:max-w-xs">
              Get a quick response by messaging me directly on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${normalizeWhatsAppNumber(PHONE_NUMBER)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-white w-full py-2 sm:py-3 rounded-md text-sm sm:text-sm font-medium transition-colors"
            >
              Chat Now
            </a>
          </div>

          {/* Call Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:p-10 hover:shadow-xs transition-shadow duration-200 flex flex-col items-center text-center w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <Phone className="w-6 sm:w-9 h-6 sm:h-9 text-red-500" aria-hidden="true" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900">Call Me</h3>
            <p className="text-gray-600 mb-6 text-sm">{PHONE_NUMBER}</p>
            <button
              onClick={handleCopy}
              className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 sm:py-3 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 inline-flex items-center justify-center gap-2"
            >
              {copyState === 'copied' ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Number
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:p-10 ">
          <h3 className="font-semibold mb-2 text-center text-gray-800">Send a Message</h3>
          <p className="text-gray-600 text-center mb-8 text-sm">Fill out the form and I’ll get back to you soon.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
              <input
                id="contact-name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</label>
              <textarea
                id="contact-message"
                placeholder="Your message..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition resize-none"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || submitted}
              className="bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-white w-full py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
            >
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <footer className="mt-24 text-gray-400 text-xs tracking-wide border-t border-gray-100 w-full max-w-6xl pt-8 text-center">
        © 2024 MyWebsite. All rights reserved.
      </footer>
    </div>
  );
}
