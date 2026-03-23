import React from 'react';
import { CATEGORIES } from '../data/categories';
import { useNavigate } from 'react-router-dom';

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    // Format category name for URL (replace spaces with hyphens, lowercase)
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/category/${formattedName}`);
  };

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
          View All →
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className="group cursor-pointer"
          >
            {/* Category Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-indigo-200">
              {/* Image Container */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Category Info */}
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {category.name}
                </h3>
                {category.itemCount && (
                  <p className="text-xs text-gray-500 mt-1">
                    {category.itemCount} items
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
