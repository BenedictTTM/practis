import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryProductsClient from './CategoryProductsClient';
import { CATEGORIES, ProductCategory } from '@/constants/categories';

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
    sortBy?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

/**
 * Generate metadata for category pages (SEO optimization)
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryConfig = CATEGORIES.find((cat) => cat.slug === params.category);

  if (!categoryConfig) {
    return {
      title: 'Category Not Found',
      description: 'The requested category does not exist.',
    };
  }

  return {
    title: `${categoryConfig.label} - Sellr Marketplace`,
    description: categoryConfig.description,
    openGraph: {
      title: `${categoryConfig.label} - Sellr Marketplace`,
      description: categoryConfig.description,
      type: 'website',
    },
  };
}

/**
 * Generate static params for all categories (SSG optimization)
 */
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

/**
 * Category Products Page
 * 
 * Displays all products in a specific category with filtering and sorting
 */
export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Validate category
  const categoryConfig = CATEGORIES.find((cat) => cat.slug === params.category);

  if (!categoryConfig) {
    notFound();
  }

  // Parse query parameters
  const page = parseInt(searchParams.page || '1', 10);
  const sortBy = searchParams.sortBy || 'newest';
  const condition = searchParams.condition;
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const inStock = searchParams.inStock !== 'false';

  return (
    <CategoryProductsClient
      category={categoryConfig.slug}
      categoryLabel={categoryConfig.label}
      categoryDescription={categoryConfig.description}
      initialPage={page}
      initialSortBy={sortBy}
      initialCondition={condition}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      initialInStock={inStock}
    />
  );
}
