import { BiLoaderAlt } from 'react-icons/bi';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-20">
          <BiLoaderAlt className="w-10 h-10 animate-spin text-black" />
        </div>
      </div>
    </div>
  );
}
