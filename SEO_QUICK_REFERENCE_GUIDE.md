# 🚀 SEO Quick Reference - MyPlug

**Last Updated:** November 13, 2025  
**Status:** ✅ Production Ready

---

## 📚 Table of Contents

1. [Content Rules](#content-rules)
2. [Component Usage](#component-usage)
3. [Schema Examples](#schema-examples)
4. [Testing URLs](#testing-urls)
5. [Common Tasks](#common-tasks)

---

## 📝 Content Rules

### Title Format

```
<Primary Keyword> — MyPlug
```

**Examples:**

- `Campus Phone Sales — MyPlug`
- `Used Textbooks — MyPlug`
- `Dell Latitude Laptop — MyPlug`
- `Student Fashion — MyPlug`

**Rules:**

- Keep short (50-60 chars)
- Include one primary keyword
- Always end with "— MyPlug"
- Use em dash (—) not hyphen (-)

### Meta Description Format

```
1-2 short sentences aimed at students. Include location when relevant.
```

**Examples:**

- `Buy and sell electronics at University of Ghana. Student-friendly prices, meet on campus.`
- `Used laptop in good condition. Meet on campus, pay cash or mobile money. Message to haggle.`
- `Find textbooks for less. UG students selling course materials. Fast campus meetup.`

**Rules:**

- 150-160 characters max
- Student-friendly tone
- Mention "University of Ghana" or "campus" when relevant
- Include action words: "Buy," "Sell," "Find," "Meet"
- Casual tone: "Message to haggle," "Meet on campus"

---

## 🧩 Component Usage

### SEO Component (Client-Side)

```tsx
import SEO from "@/Components/SEO";

<SEO
  title="Used MacBook — MyPlug"
  description="MacBook Pro 2016 in good condition. Meet on campus at University of Ghana. Message to haggle."
  canonical="https://myplug.shop/product/123"
  og={{
    title: "MacBook Pro 2016",
    image: "https://cloudinary.com/laptop.jpg",
    type: "product",
  }}
  jsonLd={productSchema}
/>;
```

### Server Component Metadata (Next.js 15 App Router)

```tsx
// app/product/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  return {
    title: `${product.title} — MyPlug`,
    description: `${product.description.substring(0, 150)}. Meet on campus.`,
    alternates: {
      canonical: `https://myplug.shop/product/${params.id}`,
    },
    openGraph: {
      title: product.title,
      description: product.description,
      type: "product",
      images: product.images,
    },
  };
}
```

---

## 📊 Schema Examples

### Product Schema (Individual Page)

```tsx
import { generateProductSchema } from "@/lib/schemas/productSchemas";

const productSchema = generateProductSchema(product);

// Returns:
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Dell Latitude Laptop",
  "image": ["https://..."],
  "description": "...",
  "sku": "product-123",
  "offers": {
    "@type": "Offer",
    "price": "800.00",
    "priceCurrency": "GHS",
    "availability": "InStock"
  }
}
```

### Breadcrumb Schema

```tsx
import { generateBreadcrumbSchema } from "@/lib/schemas/productSchemas";

const breadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Electronics", url: "/category/electronics" },
  { name: "Laptops", url: "/category/electronics/laptops" },
]);
```

### FAQ Schema (Help Page)

```tsx
import { generateFAQSchema } from "@/lib/schemas/productSchemas";

const faqSchema = generateFAQSchema([
  {
    question: "How do I buy on MyPlug?",
    answer:
      "Browse products, contact seller via WhatsApp, meet on campus to inspect and pay.",
  },
  {
    question: "Is it safe?",
    answer:
      "Always meet in public campus areas, inspect items before payment, and report suspicious activity.",
  },
]);
```

### Local Business Schema (Homepage)

```tsx
import { generateLocalBusinessSchema } from "@/lib/schemas/productSchemas";

const localSchema = generateLocalBusinessSchema();
```

---

## 🧪 Testing URLs

### Development

```
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/main/products/[id]
```

### Production

```
https://myplug.shop/robots.txt
https://myplug.shop/sitemap.xml
https://myplug.shop/main/products/[id]
```

### External Testing Tools

**Google Rich Results Test**

```
https://search.google.com/test/rich-results
```

Paste your product URL, check for Product schema errors.

**Facebook Debugger**

```
https://developers.facebook.com/tools/debug/
```

Test Open Graph tags for social sharing.

**Twitter Card Validator**

```
https://cards-dev.twitter.com/validator
```

Test Twitter Card appearance.

**Schema Markup Validator**

```
https://validator.schema.org/
```

Validate JSON-LD structured data.

**PageSpeed Insights**

```
https://pagespeed.web.dev/
```

Test Core Web Vitals and performance.

---

## 🛠️ Common Tasks

### 1. Add SEO to New Page

**Server Component (Recommended):**

```tsx
// app/new-page/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Page — MyPlug",
  description: "Short student-friendly description here.",
  alternates: {
    canonical: "https://myplug.shop/new-page",
  },
};

export default function NewPage() {
  return <main>...</main>;
}
```

**Client Component:**

```tsx
"use client";
import SEO from "@/Components/SEO";

export default function NewPage() {
  return (
    <>
      <SEO
        title="New Page — MyPlug"
        description="Short student-friendly description here."
        canonical="https://myplug.shop/new-page"
      />
      <main>...</main>
    </>
  );
}
```

### 2. Add Product Schema to Product Page

```tsx
import { generateProductSchema } from "@/lib/schemas/productSchemas";
import { MultipleSchemas } from "@/Components/Schema";

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  const productSchema = generateProductSchema(product);

  return (
    <>
      <MultipleSchemas schemas={[productSchema]} />
      <main>{/* Product content */}</main>
    </>
  );
}
```

### 3. Update Open Graph Image

**Option A: Use product image**

```tsx
openGraph: {
  images: [product.images[0]];
}
```

**Option B: Use default**

```tsx
openGraph: {
  images: ["https://myplug.shop/og-default.png"];
}
```

### 4. Add Canonical URL

```tsx
alternates: {
  canonical: "https://myplug.shop/your-page";
}
```

### 5. Disable Indexing (Private Pages)

```tsx
// Server component
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// Client component with SEO component
<SEO title="Private Page" description="..." noindex={true} />;
```

---

## 📋 SEO Checklist for New Pages

- [ ] **Title** - Short, keyword-rich, ends with "— MyPlug"
- [ ] **Description** - 1-2 sentences, student-friendly, 150-160 chars
- [ ] **Canonical URL** - Full URL with https://
- [ ] **Open Graph** - Title, description, image, type
- [ ] **Twitter Card** - summary_large_image
- [ ] **Schema** - Appropriate JSON-LD (Product, FAQ, etc.)
- [ ] **Images** - Alt text with keywords
- [ ] **Headings** - H1 with primary keyword
- [ ] **Content** - Natural keyword usage, helpful for students
- [ ] **Links** - Internal links to related pages
- [ ] **Mobile** - Test on phone (most students use mobile)

---

## 🎨 Copy Examples (Student Tone)

### Homepage

```
Title: MyPlug — Buy & Sell on Campus (University of Ghana)
Description: Buy, sell, and swap on campus. MyPlug connects University of Ghana students for books, gadgets, textbooks and more. Fast, local, student-friendly.
```

### Product Page

```
Title: Used MacBook Pro 2016 — MyPlug
Description: MacBook in good condition. Meet on campus, pay cash or mobile money. Posted by a UG student. Message to haggle.
```

### Category Page

```
Title: Campus Phone Sales — MyPlug
Description: Buy and sell phones at University of Ghana. iPhone, Samsung, and more from verified students. Meet on campus, safe trades.
```

### About Page

```
Title: About MyPlug — Campus Marketplace
Description: Student-first marketplace at the University of Ghana. We help students find great deals on study essentials and campus gear.
```

### Help Page

```
Title: Help — MyPlug
Description: How to list items, safety tips for meeting on campus, and buyer protection — everything you need to trade safely on MyPlug.
```

### Contact Page

```
Title: Contact — MyPlug
Description: Need help? Contact MyPlug support for listing issues, disputes, or suggestions. We're students helping students.
```

---

## 🚀 Deployment Checklist

### Before Deploy

- [ ] All `.env.production` variables set
- [ ] OG images created and uploaded to `/public/`
- [ ] Test all schemas with validator
- [ ] Test social sharing with Facebook Debugger
- [ ] Check robots.txt and sitemap.xml locally

### After Deploy

- [ ] Verify robots.txt accessible
- [ ] Verify sitemap.xml accessible
- [ ] Submit sitemap to Google Search Console
- [ ] Test product page in Rich Results Test
- [ ] Verify GA4 tracking (Real-Time reports)
- [ ] Test social sharing on real platforms

### Week 1 Post-Deploy

- [ ] Monitor Google Search Console for errors
- [ ] Check indexing status
- [ ] Review search queries
- [ ] Fix any crawl errors
- [ ] Monitor Core Web Vitals

---

## 📞 Quick Links

| Resource                   | URL                                          |
| -------------------------- | -------------------------------------------- |
| **Google Search Console**  | https://search.google.com/search-console     |
| **Google Analytics**       | https://analytics.google.com                 |
| **Rich Results Test**      | https://search.google.com/test/rich-results  |
| **Facebook Debugger**      | https://developers.facebook.com/tools/debug/ |
| **Twitter Card Validator** | https://cards-dev.twitter.com/validator      |
| **Schema Validator**       | https://validator.schema.org/                |
| **PageSpeed Insights**     | https://pagespeed.web.dev/                   |

---

## 💡 Tips

1. **Keep it simple** - Students scan quickly, use short sentences
2. **Be specific** - "Meet on campus" not "arrange meetup"
3. **Use emojis sparingly** - Only in social posts, not meta descriptions
4. **Test on mobile** - Most UG students browse on phones
5. **Update regularly** - Fresh content ranks better
6. **Monitor competitors** - See what works for similar sites
7. **Collect reviews** - Good ratings boost SEO
8. **Internal linking** - Link related products and categories
9. **Fast loading** - Students have limited data, optimize images
10. **Local keywords** - Always mention "University of Ghana" or "UG"

---

**Need help?** Check `SEO_IMPLEMENTATION_COMPLETE.md` for detailed implementation guide.
