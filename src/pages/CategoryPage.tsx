import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Grid3x3, List } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  // Format the category name for display
  const formatDisplayName = (urlName: string) => {
    return urlName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/And/g, '&');
  };

  const displayName = formatDisplayName(name || '');

  // Mock products for this category
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Toor Dal',
      price: 140,
      oldPrice: 160,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 2,
      name: 'Organic Moong Dal',
      price: 120,
      oldPrice: 150,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '500 g'
    },
    {
      id: 3,
      name: 'Chana Dal',
      price: 85,
      oldPrice: 100,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 4,
      name: 'Urad Dal',
      price: 110,
      oldPrice: 130,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 5,
      name: 'Masoor Dal',
      price: 95,
      oldPrice: 115,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
      weight: '1 kg'
    },
    {
      id: 6,
      name: 'Rajma',
      price: 130,
      oldPrice: 155,
      discount: 16,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
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
                <h1 className="text-xl font-bold text-gray-800">{displayName}</h1>
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
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>

                {/* Add Button */}
                <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                  ADD
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

export default CategoryPage;
