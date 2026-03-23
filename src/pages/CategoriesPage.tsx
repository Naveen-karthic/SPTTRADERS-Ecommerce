import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Layers,
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Category {
  _id: string;
  itemName: string;
  createdAt: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${API_URL}/item-master`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load categories',
      });
    }
  };

  const handleAddCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: 'Add New Category',
      input: 'text',
      inputLabel: 'Category Name',
      inputPlaceholder: 'e.g., Fertilizer, Seeds, Oil, etc.',
      showCancelButton: true,
      confirmButtonText: 'Add Category',
      confirmButtonColor: '#4f46e5',
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
          `${API_URL}/item-master`,
          { itemName: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category added successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        fetchCategories();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to add category',
        });
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${categoryName}"? This will also delete all products in this category.`,
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
        await axios.delete(`${API_URL}/item-master/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        });

        fetchCategories();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete category',
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
                <p className="text-sm text-gray-600">Manage your product categories</p>
              </div>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Categories Yet</h3>
              <p className="text-gray-500 mb-6">
                Add your first category to get started organizing your products.
              </p>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Add First Category</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Category Name
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
                  {categories.map((category, index) => (
                    <tr
                      key={category._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index === categories.length - 1 ? '' : 'border-b border-gray-200'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mr-4">
                            <Layers className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {category.itemName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(category.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteCategory(category._id, category.itemName)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
