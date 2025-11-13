/**
 * Dynamic robots.txt route
 * Serves robots.txt with proper sitemap URL
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myplug.shop";
  
  const body = `# MyPlug Robots.txt - University of Ghana Student Marketplace
# Updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /
Allow: /main/products
Allow: /category/
Allow: /search
Allow: /store/
Allow: /main/help
Allow: /main/contact

# Block authentication and private pages
Disallow: /auth/
Disallow: /api/
Disallow: /accounts/
Disallow: /main/cart
Disallow: /main/checkout
Disallow: /main/orders
Disallow: /payment-success/
Disallow: /_next/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Host
Host: ${siteUrl}
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
