/**
 * Schema Component - SEO Structured Data
 * Renders JSON-LD schema markup for SEO
 * 
 * Enterprise Architecture:
 * - Critical schemas load immediately (Organization, WebSite, WebPage)
 * - Non-critical schemas defer until after interaction (Product lists)
 * - Implements progressive enhancement strategy
 * - Optimized for Core Web Vitals (LCP, FID, CLS)
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data
 * @author Senior Frontend Architect
 * @version 3.0.0
 */

import React from 'react';
import Script from 'next/script';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Schema priority levels for loading strategy
 */
export type SchemaPriority = 'critical' | 'high' | 'low' | 'defer';

/**
 * Schema type enumeration for type safety
 */
export type SchemaType = 
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'Product'
  | 'ItemList'
  | 'Offer'
  | 'AggregateRating'
  | 'Review';

interface SchemaProps {
  schema: any;
  /** Optional: ID for the script tag */
  id?: string;
  /** Optional: Strategy for loading the script */
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' | 'worker';
  /** Optional: Priority level for schema loading */
  priority?: SchemaPriority;
  /** Optional: Schema type for better organization */
  type?: SchemaType;
}

interface MultipleSchemaProps {
  schemas: any[];
  /** Optional: Defer image-heavy schemas */
  deferImageSchemas?: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Schema loading strategy based on priority
 * Critical: Load immediately (blocking)
 * High: Load after interactive
 * Low/Defer: Lazy load on idle
 */
const SCHEMA_STRATEGY_MAP: Record<SchemaPriority, 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'> = {
  critical: 'beforeInteractive',
  high: 'afterInteractive',
  low: 'lazyOnload',
  defer: 'lazyOnload',
} as const;

/**
 * Determine if schema contains image data
 */
const hasImageData = (schema: any): boolean => {
  if (!schema) return false;
  
  const schemaStr = JSON.stringify(schema);
  return schemaStr.includes('"image"') || 
         schemaStr.includes('"@type":"ImageObject"') ||
         schemaStr.includes('"thumbnail"');
};

/**
 * Determine schema priority based on type
 */
const getSchemaPriority = (schema: any): SchemaPriority => {
  if (!schema || !schema['@type']) return 'low';
  
  const type = schema['@type'];
  
  // Critical schemas for SEO
  if (['Organization', 'WebSite', 'WebPage'].includes(type)) {
    return 'critical';
  }
  
  // High priority for navigation
  if (['BreadcrumbList'].includes(type)) {
    return 'high';
  }
  
  // Defer image-heavy schemas
  if (hasImageData(schema)) {
    return 'defer';
  }
  
  return 'low';
};

// ============================================================================
// SCHEMA COMPONENT
// ============================================================================

/**
 * Schema Component
 * Renders JSON-LD structured data for SEO with optimized loading
 * 
 * Performance Features:
 * - Automatic priority detection
 * - Minified JSON output
 * - Deferred loading for non-critical schemas
 * - Type-safe schema handling
 * 
 * @example
 * ```tsx
 * // Critical schema (loads immediately)
 * <Schema schema={organizationSchema} priority="critical" />
 * 
 * // Product schema (deferred)
 * <Schema schema={productListSchema} priority="defer" />
 * ```
 */
export function Schema({ 
  schema, 
  id, 
  strategy, 
  priority,
  type 
}: SchemaProps) {
  if (!schema) return null;

  // Auto-detect priority if not provided
  const detectedPriority = priority || getSchemaPriority(schema);
  const loadingStrategy = strategy || SCHEMA_STRATEGY_MAP[detectedPriority];

  // Generate unique ID if not provided
  const schemaId = id || `schema-${type || schema['@type'] || 'markup'}`;

  return (
    <Script
      id={schemaId}
      type="application/ld+json"
      strategy={loadingStrategy}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0), // Minified for production
      }}
    />
  );
}

/**
 * Multiple Schemas Component with Progressive Loading
 * 
 * Enterprise Features:
 * - Automatic schema prioritization
 * - Separates critical from non-critical schemas
 * - Defers image-heavy schemas for better LCP
 * - Maintains SEO best practices
 * 
 * @example
 * ```tsx
 * <MultipleSchemas 
 *   schemas={allSchemas} 
 *   deferImageSchemas={true} 
 * />
 * ```
 */
export function MultipleSchemas({ 
  schemas,
  deferImageSchemas = true 
}: MultipleSchemaProps) {
  if (!schemas || schemas.length === 0) return null;

  // Separate schemas by priority for optimal loading
  const criticalSchemas: any[] = [];
  const highPrioritySchemas: any[] = [];
  const deferredSchemas: any[] = [];

  schemas.forEach((schema) => {
    if (!schema) return;
    
    const priority = getSchemaPriority(schema);
    const shouldDefer = deferImageSchemas && hasImageData(schema);
    
    if (shouldDefer) {
      deferredSchemas.push(schema);
    } else if (priority === 'critical') {
      criticalSchemas.push(schema);
    } else if (priority === 'high') {
      highPrioritySchemas.push(schema);
    } else {
      deferredSchemas.push(schema);
    }
  });

  return (
    <>
      {/* Critical Schemas - Load First (Blocking) */}
      {criticalSchemas.map((schema, index) => (
        <Schema
          key={`critical-schema-${index}`}
          schema={schema}
          id={`schema-critical-${schema['@type']}-${index}`}
          priority="critical"
        />
      ))}

      {/* High Priority Schemas - Load After Interactive */}
      {highPrioritySchemas.map((schema, index) => (
        <Schema
          key={`high-schema-${index}`}
          schema={schema}
          id={`schema-high-${schema['@type']}-${index}`}
          priority="high"
        />
      ))}

      {/* Deferred Schemas - Lazy Load (Image-heavy, Product lists) */}
      {deferredSchemas.map((schema, index) => (
        <Schema
          key={`deferred-schema-${index}`}
          schema={schema}
          id={`schema-deferred-${schema['@type']}-${index}`}
          priority="defer"
        />
      ))}
    </>
  );
}

/**
 * Legacy component for backward compatibility
 * @deprecated Use MultipleSchemas instead
 */
export function LegacyMultipleSchemas({ schemas }: { schemas: any[] }) {
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
