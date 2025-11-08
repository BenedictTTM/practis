import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/Components/Toast/toast";
import ReactQueryProvider from "@/Components/Providers/ReactQueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// SEO Metadata - Optimized for University of Ghana student marketplace
export const metadata: Metadata = {
  // Primary metadata
  title: {
    default: "myPlug - #1 Student Marketplace for University of Ghana | Buy & Sell on Campus",
    template: "%s | myPlug - UG Student Marketplace",
  },
  description: "Ghana's #1 student marketplace for University of Ghana. Buy and sell laptops, textbooks, fashion, gadgets & more from verified UG Legon students. Fast campus delivery. Secure payments. Daily flash sales. Join 1,000+ students trading safely!",
  
  // Keywords for SEO (note: not heavily used by Google, but helpful for context)
  keywords: [
    "student marketplace Ghana",
    "University of Ghana marketplace",
    "UG buy sell",
    "Legon campus trading",
    "cheap laptops UG",
    "used textbooks Legon",
    "student gadgets Ghana",
    "campus e-commerce",
    "UG Legon products",
    "student trading platform",
    "affordable student products Ghana",
    "myPlug marketplace"
  ],

  // Author and creator
  authors: [{ name: "myPlug Team" }],
  creator: "myPlug",
  publisher: "myPlug",

  // Canonical URL and alternate
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://myplug.com.gh'),
  alternates: {
    canonical: '/',
  },

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://myplug.com.gh',
    siteName: "myPlug",
    title: "myPlug - University of Ghana Student Marketplace | Buy & Sell Safely on Campus",
    description: "Join 1,000+ UG students buying and selling laptops, textbooks, fashion & gadgets. Campus delivery, verified sellers, daily flash sales. Your trusted campus marketplace!",
    images: [
      {
        url: "/og-image.jpg", // Create this image: 1200x630px
        width: 1200,
        height: 630,
        alt: "myPlug - University of Ghana Student Marketplace",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@mypluggh",
    creator: "@mypluggh",
    title: "myPlug - University of Ghana Student Marketplace",
    description: "Buy & sell safely on campus. Laptops, textbooks, fashion & more from verified UG students. Join 1,000+ students!",
    images: ["/twitter-image.jpg"], // Create this image: 1200x600px
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (add when you have them)
  verification: {
    google: "", // Add Google Search Console verification code
    // bing: "", // Add Bing Webmaster verification code
  },

  // App specific
  applicationName: "myPlug",
  category: "E-commerce",
  
  // Additional metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "myPlug",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased bg-gray-50`}>
        <ReactQueryProvider>
          {children}
          {/* Keep ToastProvider at root level for global notifications */}
          <ToastProvider
            position="top-right"
            richColors={true}
            closeButton={true}
            expand={true}
            duration={3000}
            theme="light"
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}