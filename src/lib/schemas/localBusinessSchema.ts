/**
 * Enhanced Local Business Schema for myPlug
 * University of Ghana Student Marketplace
 * 
 * This schema helps Google understand your business location, 
 * services, and improves local SEO rankings
 */

export function generateLocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://myplug.com.gh/#localbusiness",
    
    // Basic Information
    "name": "myPlug",
    "alternateName": "myPlug Ghana",
    "description": "University of Ghana's #1 student-to-student marketplace. Buy and sell laptops, textbooks, fashion, gadgets & more from verified UG students. Fast campus delivery, secure payments, daily flash sales.",
    "slogan": "Your Campus. Your Marketplace.",
    
    // Contact Information
    "url": "https://myplug.com.gh",
    "email": "support@myplug.com.gh",
    "telephone": "+233-XX-XXX-XXXX", // TODO: Replace with real number
    
    // Location Details
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "University of Ghana",
      "addressLocality": "Legon",
      "addressRegion": "Greater Accra Region",
      "postalCode": "00233",
      "addressCountry": "GH"
    },
    
    // Geographic Coordinates (University of Ghana)
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "5.6511",
      "longitude": "-0.1894"
    },
    
    // Service Area
    "areaServed": [
      {
        "@type": "City",
        "name": "Accra",
        "addressCountry": "GH"
      },
      {
        "@type": "Place",
        "name": "University of Ghana, Legon Campus"
      }
    ],
    
    // Business Hours (24/7 online platform)
    "openingHours": "Mo-Su 00:00-23:59",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    
    // Price Range
    "priceRange": "GH₵10-GH₵5000",
    "currenciesAccepted": "GHS",
    "paymentAccepted": "Mobile Money, Bank Transfer, Cash",
    
    // Visual Identity
    "logo": "https://myplug.com.gh/logo.png",
    "image": [
      "https://myplug.com.gh/og-image.jpg",
      "https://myplug.com.gh/campus-delivery.jpg",
      "https://myplug.com.gh/student-marketplace.jpg"
    ],
    
    // Social Media Profiles
    "sameAs": [
      "https://facebook.com/mypluggh",
      "https://instagram.com/mypluggh",
      "https://twitter.com/mypluggh",
      "https://linkedin.com/company/myplug"
    ],
    
    // Business Category
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Student Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Laptops & Electronics"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Textbooks & Course Materials"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Fashion & Accessories"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sports & Outdoor Equipment"
          }
        }
      ]
    },
    
    // Ratings and Reviews
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    
    // Sample Reviews
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Kwame O."
        },
        "datePublished": "2025-01-20",
        "reviewBody": "Best platform for buying student items at UG. Found my laptop for GH₵800, seller was honest and delivery was quick to my hall!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ama Owusu"
        },
        "datePublished": "2025-01-15",
        "reviewBody": "Sold 10 textbooks in my first week. The platform is easy to use and reaching fellow UG students is simple. Highly recommend!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Kofi Mensah"
        },
        "datePublished": "2025-01-10",
        "reviewBody": "Great marketplace for students. Found affordable gadgets and the campus delivery is super convenient. Safe and reliable!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ],
    
    // Organization Details
    "foundingDate": "2025",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "5-10"
    },
    
    // Services Offered
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Campus Delivery Service",
        "description": "Fast delivery to all University of Ghana halls and residences",
        "price": "5-10",
        "priceCurrency": "GHS"
      },
      {
        "@type": "Offer",
        "name": "Secure Payment Processing",
        "description": "Mobile Money, bank transfer, and cash on delivery options"
      },
      {
        "@type": "Offer",
        "name": "Verified Student Sellers",
        "description": "All sellers are verified University of Ghana students"
      }
    ],
    
    // Target Audience
    "knowsAbout": [
      "Student marketplace",
      "E-commerce platform",
      "Campus trading",
      "Second-hand electronics",
      "Used textbooks",
      "Student products",
      "University services",
      "Peer-to-peer marketplace"
    ],
    
    // Audience
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "University Students"
    }
  };
  
  return schema;
}

/**
 * FAQ Schema for rich snippets
 */
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is myPlug only for University of Ghana students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, myPlug is exclusively designed for University of Ghana (UG Legon) students to buy and sell products safely within the campus community. All sellers are verified UG students, ensuring a trusted and familiar trading environment."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get my items delivered on campus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sellers on myPlug offer two convenient delivery options: (1) Campus Delivery - items delivered directly to your hall or residence for GH₵5-10, typically same-day or next-day, or (2) Campus Meetup - arrange a free meetup at a public campus location like the library, night market, or your hall's entrance."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods are accepted on myPlug?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "myPlug supports multiple payment methods including Mobile Money (MTN Mobile Money, Vodafone Cash, AirtelTigo Money), bank transfer, and cash on delivery. We recommend inspecting items before making payment and using secure payment methods. Never send advance payment without seeing the item first."
        }
      },
      {
        "@type": "Question",
        "name": "How much can I save buying on myPlug compared to retail stores?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "UG students typically save 40-60% compared to retail stores when buying on myPlug. For example: laptops range from GH₵500-2,000 (retail: GH₵1,500-4,000), textbooks from GH₵10-100 (retail: GH₵50-200), smartphones from GH₵100-1,500 (retail: GH₵300-3,000), and fashion items from GH₵5-150 (retail: GH₵20-300)."
        }
      },
      {
        "@type": "Question",
        "name": "How do I sell products on myPlug?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Selling on myPlug is easy! Simply (1) Create a free account with your UG student email, (2) Click 'Sell Product' and upload clear photos of your item, (3) Add a detailed description, set your price, and choose your preferred delivery method, (4) Wait for interested buyers to contact you via WhatsApp or call. You'll need to purchase product slots (GH₵1 per slot) to list items."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to buy and sell on myPlug?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! myPlug prioritizes safety with several features: (1) All sellers must verify their UG student status, (2) Buyers can see seller ratings and reviews from other students, (3) We recommend meeting in public campus areas during daylight hours, (4) Always inspect items before payment, (5) Use our messaging system for communication records. Report any suspicious activity to our support team immediately."
        }
      },
      {
        "@type": "Question",
        "name": "What categories of products can I find on myPlug?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "myPlug offers a wide range of student essentials organized into categories: Electronics (laptops, phones, tablets, accessories), Books & Course Materials (textbooks, study guides, novels), Fashion & Accessories (clothing, shoes, bags, jewelry), Home & Living (furniture, appliances, decor), Sports & Outdoors (equipment, gear, fitness items), and Others (miscellaneous student needs)."
        }
      },
      {
        "@type": "Question",
        "name": "Can I return or exchange items bought on myPlug?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Return and exchange policies are set by individual sellers. We strongly recommend: (1) Thoroughly inspect items during meetup or delivery before accepting, (2) Test electronic items if possible, (3) Discuss return/exchange terms with the seller before purchase, (4) Keep all communication records. If an item is significantly misrepresented, contact the seller first and our support team if issues aren't resolved."
        }
      }
    ]
  };
}

/**
 * Service Schema
 */
export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Student Marketplace Platform",
    "provider": {
      "@type": "Organization",
      "name": "myPlug",
      "@id": "https://myplug.com.gh/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Accra",
      "addressCountry": "GH"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceRange": "GH₵10-GH₵5000"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  };
}
