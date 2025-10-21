"use client";
import React, { useState } from "react";
import ExclusiveSection from "./exclusiveSection";
import SupportSection from "./supportsSection"
import AccountSection from "./accountsSection";
import QuickLinkSection from "./quickLinkSection";
import DownloadAppSection from "./downloadAppSection";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e?: React.SyntheticEvent) => {
    if (e && 'preventDefault' in e) {
      (e as React.SyntheticEvent).preventDefault();
    }
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="relative z-20 w-full bg-black text-white py-5 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <ExclusiveSection
            email={email}
            setEmail={setEmail}
            handleSubscribe={handleSubscribe}
          />
          <SupportSection />
          <AccountSection />
          <QuickLinkSection />
          <DownloadAppSection />
        </div>
        <div className="mt-4  text-center">
          <p className="text-sm text-gray-600">
            © Copyright Sellr 2025. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
