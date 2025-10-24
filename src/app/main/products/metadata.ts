import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Products - Sellr | Great Deals & Flash Sales',
  description: 'Discover amazing products with great deals and flash sales. Shop electronics, fashion, home goods, and more at unbeatable prices.',
  keywords: ['products', 'online shopping', 'flash sales', 'deals', 'discounts', 'e-commerce'],
  openGraph: {
    title: 'Browse Products - Sellr',
    description: 'Discover amazing products with great deals and flash sales',
    type: 'website',
    url: 'https://sellr.com/main/products',
    siteName: 'Sellr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Products - Sellr',
    description: 'Discover amazing products with great deals and flash sales',
  },
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
};
