import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCategoriesByModule } from '../data/modules';

const ModuleCategoriesPage: React.FC = () => {
  const { moduleType } = useParams<{ moduleType: string }>();
  const navigate = useNavigate();

  const modules = [
    {
      id: 'grocery',
      name: 'Grocery',
      icon: '🛒',
      description: 'Fresh groceries delivered to your doorstep',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fertilizer',
      name: 'Fertilizer',
      icon: '🌱',
      description: 'Quality fertilizers for your farm',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const module = modules.find((m) => m.id === moduleType);
  const categories = moduleType ? getCategoriesByModule(moduleType) : [];

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Module not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleCategoryClick = (categoryName: string) => {
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/module/${moduleType}/category/${formattedName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{module.icon}</span>
                <h1 className="text-2xl font-bold text-gray-800">{module.name} Categories</h1>
              </div>
              <p className="text-sm text-gray-500">{categories.length} Categories Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer"
            >
              {/* Category Card */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-indigo-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Item Count Badge */}
                  {category.itemCount && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                      <span className="text-xs font-bold text-indigo-600">
                        {category.itemCount} items
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4 text-center">
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[40px] flex items-center justify-center">
                    {category.name}
                  </h3>

                  {/* Arrow Indicator */}
                  <div className="mt-3 flex justify-center">
                    <div className="bg-indigo-100 rounded-full p-1.5 group-hover:bg-indigo-600 transition-colors">
                      <svg
                        className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleCategoriesPage;
