# Products Components

This directory contains all product-related components organized following industry best practices.

## 📁 Folder Structure

```
Products/
├── cards/              # Product card components
│   ├── ProductCard.tsx
│   └── index.ts
├── details/            # Product detail page components
│   ├── ProductActions.tsx
│   ├── ProductDetails.tsx
│   ├── ProductGallery.tsx
│   ├── ProductHeader.tsx
│   ├── ProductInfo.tsx
│   ├── ProductOptions.tsx
│   ├── ProductReviews.tsx
│   └── index.ts
├── common/             # Shared/reusable components
│   ├── LoadingStates.tsx
│   ├── QuantitySelector.tsx
│   ├── ShareProduct.tsx
│   └── index.ts
├── layouts/            # Layout-specific components
│   ├── ProductSidebar.tsx
│   └── index.ts
├── styles/             # Component-specific styles
│   └── products.css
├── index.ts            # Main export file
└── README.md          # This file
```

## 🎯 Component Categories

### Cards (`/cards`)

Components related to product listing and card displays:

- **ProductCard**: Individual product card with hover effects, pricing, ratings
- **ProductsGrid**: Responsive grid layout for multiple product cards
- **SimpleStarRating**: Reusable star rating component

### Details (`/details`)

Components for product detail pages:

- **ProductActions**: Add to cart, buy now buttons with quantity selector
- **ProductDetails**: Detailed product information and specifications
- **ProductGallery**: Image gallery with thumbnails and zoom
- **ProductHeader**: Product title, breadcrumbs, and navigation
- **ProductInfo**: Price, availability, and basic product info
- **ProductOptions**: Size, color, and other product variants
- **ProductReviews**: Customer reviews and ratings

### Common (`/common`)

Reusable components used across different product contexts:

- **LoadingStates**: Skeleton loaders, error messages, not found states
- **QuantitySelector**: Increment/decrement quantity input
- **ShareProduct**: Social sharing buttons for products

### Layouts (`/layouts`)

Layout and structural components:

- **ProductSidebar**: Filter sidebar with cart summary and user profile

## 🚀 Usage Examples

### Import from specific categories

```typescript
import { ProductCard, ProductsGrid } from "@/Components/Products/cards";
import { ProductGallery, ProductActions } from "@/Components/Products/details";
import { QuantitySelector, ShareProduct } from "@/Components/Products/common";
```

### Import from main index (recommended)

```typescript
import {
  ProductCard,
  ProductsGrid,
  ProductGallery,
  ProductActions,
  QuantitySelector,
} from "@/Components/Products";
```

## 🎨 Styling

- All components use Tailwind CSS for styling
- Custom CSS is located in `/styles/products.css`
- Color scheme follows brand guidelines:
  - Primary: `#E43C3C` (red)
  - Text: `#2E2E2E` (dark gray)
  - Background: `#F8F8F8` (light gray)

## 📝 Best Practices

1. **Component Naming**: PascalCase for component files and exports
2. **Index Files**: Clean exports through index.ts files
3. **TypeScript**: Full type safety with exported interfaces
4. **Documentation**: JSDoc comments for all public components
5. **Performance**: Optimized with React.memo where appropriate
6. **Accessibility**: ARIA labels and keyboard navigation support

## 🔧 Development Guidelines

1. Keep components focused and single-responsibility
2. Use TypeScript interfaces for all props
3. Add JSDoc comments for complex components
4. Follow existing naming conventions
5. Export types alongside components
6. Test components in isolation

## 📦 Dependencies

- React 18+
- Next.js 14+
- Tailwind CSS
- Lucide React (icons)
- React Icons

## 🧪 Testing

Components should be tested with:

- Unit tests for individual components
- Integration tests for component interactions
- Visual regression tests for UI consistency
