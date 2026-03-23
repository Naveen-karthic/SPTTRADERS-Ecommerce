import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface FertilizerCategory {
  _id: string;
  categoryName: string;
}

interface FertilizerProduct {
  _id?: string;
  productName: string;
  itemCode: string;
  price: number;
  discount: number;
  unit: string;
  fertilizerCategoryId: string | FertilizerCategory;
  image?: string;
  manufacturer?: string;
  composition?: string;
  weight?: string;
}

interface FertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: FertilizerProduct;
  categories: FertilizerCategory[];
}

const FertilizerModal: React.FC<FertilizerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
}) => {
  const isEditing = !!product?._id;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    productName: '',
    itemCode: '',
    price: '',
    discount: '0',
    unit: 'pcs',
    fertilizerCategoryId: '',
    manufacturer: '',
    composition: '',
    weight: '',
    type: 'unit',
  });

  const units = ['pcs', 'kg', 'g', 'l', 'ml', 'packet', 'bag', 'box'];

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        itemCode: product.itemCode || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        unit: product.unit || 'pcs',
        fertilizerCategoryId: typeof product.fertilizerCategoryId === 'string'
          ? product.fertilizerCategoryId
          : product.fertilizerCategoryId?._id || '',
        manufacturer: product.manufacturer || '',
        composition: product.composition || '',
        weight: product.weight || '',
        type: 'unit',
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    } else {
      setFormData({
        productName: '',
        itemCode: '',
        price: '',
        discount: '0',
        unit: 'pcs',
        fertilizerCategoryId: '',
        manufacturer: '',
        composition: '',
        weight: '',
        type: 'unit',
      });
      setImagePreview('');
    }
  }, [product, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.itemCode || !formData.price || !formData.fertilizerCategoryId) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('itemCode', formData.itemCode);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('fertilizerCategoryId', formData.fertilizerCategoryId);
      formDataToSend.append('type', formData.type);
      if (formData.manufacturer) formDataToSend.append('manufacturer', formData.manufacturer);
      if (formData.composition) formDataToSend.append('composition', formData.composition);
      if (formData.weight) formDataToSend.append('weight', formData.weight);

      // Append image if exists
      if (imagePreview && !imagePreview.startsWith('data:')) {
        formDataToSend.append('existingImage', imagePreview);
      }

      // Handle file upload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        formDataToSend.append('image', fileInput.files[0]);
      }

      if (isEditing && product._id) {
        await axios.put(`${API_URL}/fertilizer-products/${product._id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_URL}/fertilizer-products`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Fertilizer product ${isEditing ? 'updated' : 'added'} successfully`,
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} fertilizer product`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Fertilizer Product' : 'Add New Fertilizer Product'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing ? 'Update fertilizer product information' : 'Fill in the details to add a new fertilizer product'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Image Upload */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Product Image
            </h3>
            <div className="flex items-start space-x-6">
              {imagePreview ? (
                <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose product image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-600 file:text-white
                      hover:file:bg-green-700
                      cursor-pointer"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, at least 500x500px. Max size: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., Urea Fertilizer"
                />
              </div>

              {/* Item Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code *
                </label>
                <input
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., FERT-001"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fertilizer Category *
                </label>
                <select
                  name="fertilizerCategoryId"
                  value={formData.fertilizerCategoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%) *
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., IFCO"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., 50kg"
                />
              </div>

              {/* Composition */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Composition
                </label>
                <input
                  type="text"
                  name="composition"
                  value={formData.composition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., N:P:K 10:26:26"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold flex items-center space-x-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? 'Update Product' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FertilizerModal;
