import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Grid3x3, List, ShoppingCart } from 'lucide-react';

const ModuleCategoryProductsPage: React.FC = () => {
  const { moduleType, categoryName } = useParams<{ moduleType: string; categoryName: string }>();
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

  // Format the category name for display
  const formatDisplayName = (urlName: string) => {
    return urlName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/And/g, '&');
  };

  const displayName = formatDisplayName(categoryName || '');

  // Mock products data - in real app, fetch based on moduleType and categoryName
  const mockProducts = [
    {
      id: 1,
      name: `Premium ${displayName}`,
      price: 140,
      oldPrice: 160,
      discount: 12,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 2,
      name: `Organic ${displayName}`,
      price: 120,
      oldPrice: 150,
      discount: 20,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '500 g'
    },
    {
      id: 3,
      name: `Premium Quality ${displayName}`,
      price: 85,
      oldPrice: 100,
      discount: 15,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 4,
      name: `Special ${displayName}`,
      price: 110,
      oldPrice: 130,
      discount: 15,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 5,
      name: `Deluxe ${displayName}`,
      price: 95,
      oldPrice: 115,
      discount: 17,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 6,
      name: `Gold ${displayName}`,
      price: 130,
      oldPrice: 155,
      discount: 16,
      image: module?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '500 g'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  {module && <span className="text-xl">{module.icon}</span>}
                  <h1 className="text-xl font-bold text-gray-800">{displayName}</h1>
                </div>
                <p className="text-sm text-gray-500">{mockProducts.length} Products</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </button>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button className="p-2 bg-indigo-600 text-white">
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-50">
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate(`/module/${moduleType}/categories`)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              {module?.name}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-indigo-600 font-semibold">{displayName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative">
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{product.weight}</p>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.oldPrice}</span>
                  )}
                </div>

                {/* Add Button */}
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleCategoryProductsPage;
