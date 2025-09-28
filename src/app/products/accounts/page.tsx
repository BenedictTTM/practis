'use client';

import { useRef, useState } from 'react';
import ImageGrid from '../../../Components/ProductsComponents/imageGrid';
import ProductFormFields from '../../../Components/ProductsComponents/productFromFields';
import VerticalNavigation from '@/Components/Navigation/verticalProductNav';

const MAX_IMAGES = 3;

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate discount dynamically
  const calcDiscount = () => {
    const original = parseFloat(form.originalPrice);
    const discounted = parseFloat(form.discountedPrice);
    if (!original || !discounted || original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => {
        const newImages = [...prev];
        if (typeof idx === 'number') {
          newImages[idx] = files[0];
        } else {
          newImages.push(...files);
        }
        return newImages.slice(0, MAX_IMAGES);
      });
    }
  };

  const handleAddImageClick = (idx: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.idx = idx.toString();
      fileInputRef.current.click();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.dataset.idx);
    handleImageChange(e, isNaN(idx) ? undefined : idx);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <>
    <VerticalNavigation />
    <div className="min-h-screen  flex items-center justify-center py-8">
      <div className="w-full max-w-2xl  rounded-xl  p-8">
        <h1 className="text-3xl font-medium mb-6 text-center text-primary">Create Product</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageGrid
            images={images}
            onAddImageClick={handleAddImageClick}
            fileInputRef={fileInputRef}
            onFileInputChange={onFileInputChange}
            maxImages={MAX_IMAGES}
          />
          <ProductFormFields form={form} handleChange={handleChange} />
          <div className="text-right text-sm text-gray-500">
            Discount: {calcDiscount()}%
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-center">Product created successfully!</div>}
      </div>
    </div>
    </>
  );
}