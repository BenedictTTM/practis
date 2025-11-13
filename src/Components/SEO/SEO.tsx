/**
 * SEO Component - Reusable SEO meta tags and structured data
 * 
 * Features:
 * - Dynamic meta tags (title, description, robots)
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - JSON-LD structured data support
 * - Canonical URL management
 * 
 * @version 1.0.0
 * @author MyPlug Team
 */

"use client";

import Head from "next/head";
import React from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type OpenGraph = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
};

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  og?: OpenGraph;
  twitterCard?: string;
  jsonLd?: object | null; // JSON-LD object (Product schema etc.)
  noindex?: boolean; // For pages that shouldn't be indexed
};

// ============================================================================
// SEO COMPONENT
// ============================================================================

/**
 * SEO Component
 * 
 * @example
 * ```tsx
 * <SEO
 *   title="Buy Laptops — MyPlug"
 *   description="Affordable laptops for UG students."
 *   canonical="https://myplug.shop/products/laptop-123"
 *   og={{
 *     title: "Dell Latitude Laptop",
 *     image: "https://cloudinary.com/laptop.jpg",
 *     type: "product"
 *   }}
 *   jsonLd={productSchema}
 * />
 * ```
 */
export default function SEO({
  title,
  description,
  canonical,
  og,
  twitterCard = "summary_large_image",
  jsonLd = null,
  noindex = false,
}: SEOProps) {
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://myplug.shop";

  const ogTitle = og?.title ?? title;
  const ogDescription = og?.description ?? description;
  const ogUrl = og?.url ?? canonical ?? domain;
  const ogImage = og?.image ?? `${domain}/og-default.png`;
  const ogType = og?.type ?? "website";

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="MyPlug" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="MyPlug — campus marketplace" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
