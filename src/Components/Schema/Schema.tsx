/**
 * Schema Component - SEO Structured Data
 * Renders JSON-LD schema markup for SEO
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import React from 'react';
import Script from 'next/script';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SchemaProps {
  schema: any;
  /** Optional: ID for the script tag */
  id?: string;
  /** Optional: Strategy for loading the script */
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' | 'worker';
}

// ============================================================================
// SCHEMA COMPONENT
// ============================================================================

/**
 * Schema Component
 * Renders JSON-LD structured data for SEO
 * 
 * @example
 * <Schema schema={productListSchema} id="product-list-schema" />
 */
export function Schema({ schema, id, strategy = 'afterInteractive' }: SchemaProps) {
  if (!schema) return null;

  return (
    <Script
      id={id || 'schema-markup'}
      type="application/ld+json"
      strategy={strategy}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0), // Minified for production
      }}
    />
  );
}

/**
 * Multiple Schemas Component
 * Renders multiple schema objects
 */
export function MultipleSchemas({ schemas }: { schemas: any[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <Schema
          key={`schema-${index}`}
          schema={schema}
          id={`schema-markup-${index}`}
        />
      ))}
    </>
  );
}

export default Schema;
