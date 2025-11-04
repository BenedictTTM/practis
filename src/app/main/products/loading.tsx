"use client";

import React, { useMemo } from "react";
import { DotLoader } from "../../../Components/Loaders";
import { MultipleSchemas } from "../../../Components/Schema";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "../../../lib/schemas/productSchemas";

export default function Loading() {
  // Minimal, truthful schemas during loading (no product list until data is ready)
  const schemas = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://sellr.com";
    const currentUrl = typeof window !== "undefined" ? window.location.href : `${baseUrl}/main/products`;

    return [
      generateOrganizationSchema("Sellr", baseUrl, `${baseUrl}/logo.png`),
      generateWebsiteSchema('Sellr', baseUrl, '/search?q={search_term_string}'),
      generateWebPageSchema(
        "Browse Products - Sellr",
        "Discover amazing products with great deals and flash sales.",
        currentUrl
      ),
      generateBreadcrumbSchema(
        [
          { name: "Home", url: "/" },
          { name: "Products", url: "/main/products" },
        ],
        baseUrl
      ),
    ];
  }, []);

  return (
    <>
      <MultipleSchemas schemas={schemas} />

      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        role="status"
        aria-live="polite"
        aria-label="Loading products"
      >
        <div className="text-center">
          <DotLoader size={60} color="#E43C3C" ariaLabel="Loading products" />
          <p className="text-[#2E2E2E] font-medium mt-6">Loading products…</p>
          <p className="text-gray-500 text-sm mt-2">Just a moment</p>
        </div>
      </div>
    </>
  );
}
