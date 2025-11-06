import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, ProductCategory } from '@/constants/categories';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

/**
 * Generate metadata for category pages (SEO optimization)
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryConfig = CATEGORIES.find((cat) => cat.slug === category);

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
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Await params and searchParams
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  // Validate category
  const categoryConfig = CATEGORIES.find((cat) => cat.slug === category);

  if (!categoryConfig) {
    notFound();
  }

  // Parse query parameters
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const sortBy = resolvedSearchParams.sortBy || 'newest';
  const condition = resolvedSearchParams.condition;
  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined;
  const inStock = resolvedSearchParams.inStock !== 'false';

}
