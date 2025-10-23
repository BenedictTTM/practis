'use client';

import { useRef, useState, useEffect } from 'react';
import { IoAdd, IoImageOutline, IoClose, IoCamera } from 'react-icons/io5';
import Image from 'next/image';
import { TfiReload } from "react-icons/tfi";
import { useToast } from '@/Components/Toast/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MAX_IMAGES = 5;

// Zod validation schema
const productSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .min(30, 'Description must be at least 30 characters'),
  originalPrice: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Original price must be a positive number',
    }),
  discountedPrice: z.string()
    .refine((val) => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'Discounted price must be a positive number or empty',
    })
    .optional(),
  category: z.string()
    .min(1, 'Please select a category'),
  condition: z.string()
    .min(1, 'Please select a condition'),
  tags: z.string()
    .min(1, 'Tags are required')
    .refine((val) => {
      const tagsArray = val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      return tagsArray.length >= 2;
    }, {
      message: 'Please provide at least 2 tags separated by commas',
    }),
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  stock: z.string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: 'Stock must be a non-negative number',
    }),
  images: z.array(z.instanceof(File))
    .min(1, 'At least one product image is required')
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
}).refine((data) => {
  if (data.discountedPrice && data.discountedPrice !== '') {
    const original = parseFloat(data.originalPrice);
    const discounted = parseFloat(data.discountedPrice);
    return discounted < original;
  }
  return true;
}, {
  message: 'Discounted price must be less than original price',
  path: ['discountedPrice'],
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const { showSuccess, showError } = useToast();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      condition: '',
      tags: '',
      locationLat: '',
      locationLng: '',
      stock: '',
      images: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);

  // Watch form values for dynamic calculations
  const originalPrice = watch('originalPrice');
  const discountedPrice = watch('discountedPrice');

  // Debug cookies on mount
  useEffect(() => {
    console.log('🍪 All cookies:', document.cookie);
    console.log('🍪 Checking for access_token...');
    
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('access_token=')
    );
    
    if (accessTokenCookie) {
      console.log('✅ Access token cookie found:', accessTokenCookie.substring(0, 30) + '...');
    } else {
      console.log('❌ No access_token cookie found');
      console.log('Available cookies:', cookies);
    }
  }, []);

  // Calculate discount dynamically
  const calcDiscount = () => {
    const original = parseFloat(originalPrice);
    const discounted = parseFloat(discountedPrice);
    if (!original || !discounted || original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = [...images, ...files].slice(0, MAX_IMAGES);
      setImages(newImages);
      setValue('images', newImages);
      trigger('images'); // Trigger validation for images field
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
    trigger('images'); // Trigger validation for images field
  };

  const handleSubmit = async (data: ProductFormData) => {
    console.log('Form submitted!', data);

    const discount = calcDiscount();

    try {
      const formData = new FormData();
      images.forEach(file => formData.append('images', file));
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('originalPrice', data.originalPrice);
      formData.append('discountedPrice', data.discountedPrice || '');
      formData.append('category', data.category);
      formData.append('discount', discount.toString());
      formData.append('condition', data.condition);
      formData.append('locationLat', data.locationLat || '');
      formData.append('locationLng', data.locationLng || '');
      formData.append('stock', data.stock);

      const rawTags = data.tags || "";
      const tagsArray = rawTags
        .split(',')
        .map(tag => tag.trim())
        .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);

      tagsArray.forEach(tag => formData.append('tags', tag));

      console.log("Sending response with cookies");

      const response = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log('📊 Response status:', response.status);
      const responseData = await response.json();
      console.log('📦 Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }

      showSuccess('Product Created Successfully!', {
        description: `${data.title} has been added to your store.`,
        duration: 5000,
        icon: '🎉',
      });

      // Reset form and images
      reset();
      setImages([]);
    } catch (err: any) {
      showError('Failed to Create Product', {
        description: err.message || 'Please try again later.',
        duration: 5000,
      });
      console.error('Error in handleSubmit:', err);
    }
  };

  const handleReset = () => {
    reset();
    setImages([]);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
              <p className="text-sm text-red-800 mt-1">Create a new product listing for your store</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-5">
              {/* Product Information */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Product Information</h2>
                </div>
                <div className="p-5 space-y-5">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter product title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your product"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        {...register('category')}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="home">Home & Garden</option>
                        <option value="books">Books</option>
                        <option value="sports">Sports & Outdoors</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <select
                        id="condition"
                        {...register('condition')}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                      {errors.condition && (
                        <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags * <span className="text-xs text-gray-500 font-normal">(Minimum 2 tags)</span>
                    </label>
                    <input
                      type="text"
                      id="tags"
                      {...register('tags')}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="e.g., smartphone, android, samsung (comma separated)"
                    />
                    {errors.tags && (
                      <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (GHS) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₵</span>
                        <input
                          type="number"
                          id="originalPrice"
                          {...register('originalPrice')}
                          min="0"
                          step="0.01"
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.originalPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.originalPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Price (GHS)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₵</span>
                        <input
                          type="number"
                          id="discountedPrice"
                          {...register('discountedPrice')}
                          min="0"
                          step="0.01"
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.discountedPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.discountedPrice.message}</p>
                      )}
                    </div>
                  </div>

                  {calcDiscount() > 0 && (
                    <div className=" ">
                      <div className="flex items-center">
                        <div className="text-red-600 text-sm font-semibold">
                         <span className='text-gray-700 italic font-thin'>Discount:</span>  {calcDiscount()}% off
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      {...register('stock')}
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Product Images */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Product Images *</h2>
                  <p className="text-xs text-gray-500 mt-1">Add up to {MAX_IMAGES} images (Required)</p>
                </div>
                <div className="p-5">
                  {/* Main Image Preview */}
                  <div className="mb-3">
                    <div className={`aspect-square bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden transition-colors ${
                      errors.images ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      {images.length > 0 ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(images[0])}
                            alt="Main product image"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(0)}
                            aria-label="Remove main image"
                            title="Remove image"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <IoClose className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <IoCamera className="mx-auto h-10 w-10 text-gray-400" />
                          <div className="mt-3">
                            <label htmlFor="main-image" className="cursor-pointer">
                              <span className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                                Upload main image
                              </span>
                              <input
                                id="main-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Validation Error */}
                  {errors.images && (
                    <p className="mb-3 text-sm text-red-600">{errors.images.message}</p>
                  )}

                  {/* Additional Images */}
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(1).map((image, index) => (
                      <div key={index + 1} className="relative aspect-square">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Product image ${index + 2}`}
                          fill
                          className="object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index + 1)}
                          aria-label={`Remove image ${index + 2}`}
                          title="Remove image"
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <IoClose className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < MAX_IMAGES && (
                      <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
                        <label htmlFor="additional-images" className="cursor-pointer w-full h-full flex items-center justify-center">
                          <span className="sr-only">Add more images</span>
                          <IoAdd className="h-7 w-7 text-gray-400" />
                          <input
                            id="additional-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="sr-only"
                            aria-label="Upload additional product images"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Status */}
              <div className=" ">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Product Status</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Visibility</span>
                      <span className="text-sm text-gray-600 font-medium">Public</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Created</span>
                      <span className="text-sm text-gray-600 font-medium">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white border border-gray-200 bg-white rounded-lg transition-all shadow-sm"
                title="Refresh"
                onClick={handleReset}
              >
                <TfiReload className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
              >
                {isSubmitting ? 'Publishing...' : 'Add to Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}