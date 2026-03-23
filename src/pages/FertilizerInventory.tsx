import React, { useState, useEffect } from 'react';
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Search,
  Layers,
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import FertilizerModal from '../components/FertilizerModal';

interface FertilizerCategory {
  _id: string;
  categoryName: string;
}

interface FertilizerProduct {
  _id: string;
  productName: string;
  itemCode: string;
  price: number;
  discount: number;
  unit: string;
  fertilizerCategoryId: {
    _id: string;
    categoryName: string;
  };
  image?: string;
  manufacturer?: string;
  composition?: string;
  weight?: string;
  createdAt?: string;
}

const FertilizerInventory: React.FC = () => {
  const [categories, setCategories] = useState<FertilizerCategory[]>([]);
  const [products, setProducts] = useState<FertilizerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FertilizerProduct | undefined>(undefined);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${API_URL}/fertilizer-categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching fertilizer categories:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${API_URL}/fertilizer-products`);

      // Safely handle product data
      const productsData = response.data.products || [];
      const formattedProducts = productsData.map((product: any) => ({
        ...product,
        fertilizerCategoryId: product.fertilizerCategoryId || { _id: '', categoryName: 'Unknown' },
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching fertilizer products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load fertilizer products',
      });
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const result = await Swal.fire({
      title: 'Delete Fertilizer Product?',
      text: `Are you sure you want to delete "${productName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/fertilizer-products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Fertilizer product has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        });

        fetchAllProducts();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete fertilizer product',
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleModalSuccess = () => {
    fetchAllProducts();
  };

  const handleAddCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: 'Add New Fertilizer Category',
      input: 'text',
      inputLabel: 'Category Name',
      inputPlaceholder: 'e.g., Urea, NPK, Organic, etc.',
      showCancelButton: true,
      confirmButtonText: 'Add Category',
      confirmButtonColor: '#16a34a',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a category name';
        }
      }
    });

    if (categoryName) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const token = localStorage.getItem('token');
        await axios.post(
          `${API_URL}/fertilizer-categories`,
          { categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Fertilizer category added successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        fetchCategories(); // Refresh categories list
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to add fertilizer category',
        });
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.productName?.toLowerCase().includes(searchLower) ||
      product.itemCode?.toLowerCase().includes(searchLower) ||
      product.fertilizerCategoryId?.categoryName?.toLowerCase().includes(searchLower) ||
      product.manufacturer?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-3 mb-6">
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-lg shadow-purple-200"
          >
            <Layers className="w-5 h-5" />
            <span>Add Category</span>
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg shadow-green-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search fertilizer products by name, code, category, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try a different search term' : 'Add your first product to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Product</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index === filteredProducts.length - 1 ? '' : 'border-b border-gray-200'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center mr-4 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.productName || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {product.productName || 'Unnamed Product'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.itemCode || 'N/A'} • {product.unit?.toUpperCase() || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.fertilizerCategoryId?.categoryName || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-bold text-gray-900">
                            ₹{product.price?.toFixed(2) || '0.00'}
                          </div>
                          {product.discount && product.discount > 0 && (
                            <div className="text-xs text-green-600 font-semibold">
                              {product.discount}% off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.productName)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Fertilizer Product Modal */}
      <FertilizerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  );
};

export default FertilizerInventory;
