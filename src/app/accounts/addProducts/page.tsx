'use client';

import { useRef, useState } from 'react';
import { IoAdd, IoImageOutline, IoClose, IoCamera } from 'react-icons/io5';
import Image from 'next/image';
import { TfiReload } from "react-icons/tfi";

const MAX_IMAGES = 5;

export default function CreateProductPage() {
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'bundling'>('none');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate discount dynamically
  const calcDiscount = () => {
    const original = parseFloat(form.originalPrice);
    const discounted = parseFloat(form.discountedPrice);
    if (!original || !discounted || original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', form);
    setError(null);
    setSuccess(false);
    setLoading(true);

    const discount = calcDiscount();
    if (discount < 0) {
      setError('Discount cannot be negative. Discounted price must be less than original price.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      images.forEach(file => formData.append('images', file));
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('originalPrice', form.originalPrice);
      formData.append('discountedPrice', form.discountedPrice);
      formData.append('category', form.category);
      formData.append('discount', discount.toString());
      formData.append('condition', form.condition);
      formData.append('locationLat', form.locationLat);
      formData.append('locationLng', form.locationLng);
      formData.append('stock', form.stock);

      const rawTags = form.tags || "";
      const tagsArray = rawTags
        .split(',')
        .map(tag => tag.trim())
        .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);

      tagsArray.forEach(tag => formData.append('tags', tag));

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setImages([]);
      setForm({
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
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error in handleSubmit:', err);
    } finally {
      setLoading(false);
    }
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
  
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 shadow-sm">
            <div className="w-5 h-5 text-red-500 font-bold">⚠</div>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 shadow-sm">
            <div className="w-5 h-5 text-green-600 font-bold">✓</div>
            <p className="text-green-700 text-sm font-medium">Product created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter product title"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your product"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
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
                    </div>

                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter tags separated by commas"
                    />
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
                          name="originalPrice"
                          value={form.originalPrice}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="0.00"
                        />
                      </div>
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
                          name="discountedPrice"
                          value={form.discountedPrice}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {calcDiscount() > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-red-700 text-sm font-semibold">
                          Discount: {calcDiscount()}% off
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
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Product Images */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Product Images</h2>
                  <p className="text-xs text-gray-500 mt-1">Add up to {MAX_IMAGES} images</p>
                </div>
                <div className="p-5">
                  {/* Main Image Preview */}
                  <div className="mb-3">
                    <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-300 transition-colors">
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
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <IoClose className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < MAX_IMAGES && (
                      <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
                        <label htmlFor="additional-images" className="cursor-pointer w-full h-full flex items-center justify-center">
                          <IoAdd className="h-7 w-7 text-gray-400" />
                          <input
                            id="additional-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="sr-only"
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
                onClick={() => {
                  setImages([]);
                  setForm({
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
                  });
                  setError(null);
                  setSuccess(false);
                }}
              >
                <TfiReload className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
              >
                {loading ? 'Publishing...' : 'Add to Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}