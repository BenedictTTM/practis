"use client";

import React, { useMemo } from "react";
import SharedLoading from "../../../Components/Loaders/SharedLoading";
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
      <SharedLoading size={60} color="#E43C3C" message="Loading products…" subMessage="Just a moment" />
    </>
  );
}
