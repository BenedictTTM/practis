/**
 * Product Categories - Aligned with Backend Enum
 * Matches ProductCategory enum from backend
 */

export enum ProductCategory {
  CLOTHES = 'clothes',
  ACCESSORIES = 'accessories',
  HOME = 'home',
  BOOKS = 'books',
  SPORTS_AND_OUTING = 'sports_and_outing',
  OTHERS = 'others',
}

/**
 * Category display configuration
 */
export interface CategoryConfig {
  slug: ProductCategory;
  label: string;
  description: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: ProductCategory.CLOTHES,
    label: 'Clothes & Fashion',
    description: 'Clothing, apparel, and fashion items',
  },
  {
    slug: ProductCategory.ACCESSORIES,
    label: 'Accessories',
    description: 'Fashion accessories, jewelry, bags, and more',
  },
  {
    slug: ProductCategory.HOME,
    label: 'Home & Living',
    description: 'Home decor, furniture, and household items',
  },
  {
    slug: ProductCategory.BOOKS,
    label: 'Books & Media',
    description: 'Books, textbooks, magazines, and educational materials',
  },
  {
    slug: ProductCategory.SPORTS_AND_OUTING,
    label: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, and fitness items',
  },
  {
    slug: ProductCategory.OTHERS,
    label: 'Other Items',
    description: 'Miscellaneous items and unique products',
  },
];

// For backward compatibility
export const categories = CATEGORIES.map((cat) => cat.label);
