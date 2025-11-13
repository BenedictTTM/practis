/**
 * Product Schema Generator for SEO
 * Generates JSON-LD structured data for Google Rich Results
 * 
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */

import { Product } from '@/types/products';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProductListSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    item: {
      '@type': string;
      name: string;
      image: string[];
      description: string;
      url?: string;
      offers: {
        '@type': string;
        price: number;
        priceCurrency: string;
        availability: string;
        itemCondition: string;
      };
      aggregateRating?: {
        '@type': string;
        ratingValue: number;
        reviewCount: number;
      };
    };
  }>;
}

interface WebPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
}

interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

interface OfferCatalogSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  itemListElement: Array<{
    '@type': string;
    name: string;
    description: string;
    image: string[];
    offers: {
      '@type': string;
      price: number;
      priceCurrency: string;
      availability: string;
    };
  }>;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get availability status for schema
 */
const getAvailabilityStatus = (product: Product): string => {
  if (product.isSold) return 'https://schema.org/SoldOut';
  if (!product.isActive) return 'https://schema.org/Discontinued';
  if ((product.stock || 0) > 0) return 'https://schema.org/InStock';
  return 'https://schema.org/OutOfStock';
};

/**
 * Get item condition for schema
 */
const getItemCondition = (condition?: string): string => {
  const conditionMap: Record<string, string> = {
    'new': 'https://schema.org/NewCondition',
    'used': 'https://schema.org/UsedCondition',
    'refurbished': 'https://schema.org/RefurbishedCondition',
  };
  
  return conditionMap[condition?.toLowerCase() || 'new'] || 'https://schema.org/NewCondition';
};

/**
 * Get first valid image URL
 */
const getImageUrl = (product: Product): string[] => {
  const images = product.imageUrl || product.images || [];
  return images.length > 0 ? images : ['https://via.placeholder.com/300'];
};

/**
 * Get product price
 */
const getProductPrice = (product: Product): number => {
  return product.discountedPrice || product.originalPrice || 0;
};

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

/**
 * Generate Product List Schema (ItemList)
 * For product listing pages with multiple products
 */
export function generateProductListSchema(
  products: Product[],
  baseUrl: string = 'https://sellr.com',
  priceCurrency: string = 'USD'
): ProductListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        image: getImageUrl(product),
        description: product.description || product.title,
        url: `${baseUrl}/main/products/${product.id}`,
        offers: {
          '@type': 'Offer',
          price: getProductPrice(product),
          priceCurrency,
          availability: getAvailabilityStatus(product),
          itemCondition: getItemCondition(product.condition),
        },
        ...(product.averageRating && product.totalReviews && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: product.totalReviews,
          },
        }),
      },
    })),
  };
}

/**
 * Generate WebPage Schema
 * For the main products page
 */
export function generateWebPageSchema(
  title: string = 'Browse Products',
  description: string = 'Discover amazing products with great deals',
  url: string = 'https://sellr.com/main/products'
): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
  };
}

/**
 * Generate Breadcrumb Schema
 * For navigation breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
  baseUrl: string = 'https://sellr.com'
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${baseUrl}${item.url}` }),
    })),
  };
}

/**
 * Generate Offer Catalog Schema for Flash Sales
 * Special schema for promotional offers
 */
export function generateFlashSalesSchema(
  flashSaleProducts: Product[],
  nextRefreshAt?: string
): OfferCatalogSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Flash Sales',
    description: `Special flash sale offers with up to 70% discount. ${nextRefreshAt ? `Ends at ${new Date(nextRefreshAt).toLocaleString()}` : ''}`,
    itemListElement: flashSaleProducts.map(product => ({
      '@type': 'Offer',
      name: product.title,
      description: product.description || product.title,
      image: getImageUrl(product),
      offers: {
        '@type': 'Offer',
        price: getProductPrice(product),
        priceCurrency: 'USD',
        availability: getAvailabilityStatus(product),
      },
    })),
  };
}

/**
 * Generate Organization Schema
 * For the website/business
 */
export function generateOrganizationSchema(
  name: string = 'Sellr',
  url: string = 'https://sellr.com',
  logo: string = 'https://sellr.com/logo.png'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logo,
  };
}

/**
 * Combine multiple schemas into one script
 */
export function combineSchemas(...schemas: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

// ============================================================================
// INDIVIDUAL PRODUCT SCHEMA (For Product Detail Pages)
// ============================================================================

/**
 * Generate Product JSON-LD schema for individual product pages
 * 
 * @param product - Product object from your database
 * @returns JSON-LD object for Product schema
 */
export function generateProductSchema(product: Product) {
  const images = getImageUrl(product);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myplug.shop';

  // Calculate rating values
  const ratingValue = product.averageRating || 4.5;
  const reviewCount = product.totalReviews || 0;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: images.slice(0, 5), // Google prefers multiple images
    description: product.description || `Buy ${product.title} from University of Ghana student. ${product.condition || 'Good'} condition.`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.user?.storeName || "MyPlug Student Seller",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/main/products/${product.id}`,
      priceCurrency: "GHS",
      price: getProductPrice(product).toString(),
      availability: getAvailabilityStatus(product),
      itemCondition: getItemCondition(product.condition),
      seller: {
        "@type": "Organization",
        name: "MyPlug",
      },
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingValue.toString(),
        reviewCount: reviewCount.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
    category: product.category || "General",
  };
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

/**
 * Generate FAQ JSON-LD schema
 * 
 * @param faqs - Array of FAQ items [{ question, answer }]
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// LOCAL BUSINESS SCHEMA
// ============================================================================

/**
 * Generate LocalBusiness JSON-LD schema
 * For local SEO at University of Ghana
 */
export function generateLocalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myplug.shop';
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MyPlug",
    description: "University of Ghana student marketplace for buying and selling campus essentials",
    url: baseUrl,
    telephone: "+233-XX-XXX-XXXX", // Update with real number
    email: "support@myplug.shop",
    address: {
      "@type": "PostalAddress",
      streetAddress: "University of Ghana",
      addressLocality: "Legon",
      addressRegion: "Greater Accra",
      postalCode: "00233",
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "5.6511",
      longitude: "-0.1894",
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "GH₵10-GH₵5000",
    image: `${baseUrl}/og-default.png`,
    sameAs: [
      "https://facebook.com/myplug",
      "https://instagram.com/myplug",
      "https://twitter.com/myplug",
    ],
  };
}

// ----------------------------------------------------------------------------
// WebSite Schema with SearchAction
// ----------------------------------------------------------------------------

interface WebsiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

/**
 * Generate WebSite Schema (with SearchAction for sitelinks search box)
 */
export function generateWebsiteSchema(
  siteName: string = 'Sellr',
  baseUrl: string = 'https://sellr.com',
  searchPathTemplate: string = '/search?q={search_term_string}'
): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}${searchPathTemplate}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
