import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Statistics
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// User Management
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Products
export const getAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (productData: any, imageFile?: File) => {
  const formData = new FormData();

  // Append all product fields
  formData.append('productName', productData.productName);
  formData.append('itemCode', productData.itemCode);
  formData.append('price', productData.price.toString());
  formData.append('discount', (productData.discount || 0).toString());
  formData.append('itemMasterId', productData.itemMasterId);

  if (productData.description) {
    formData.append('description', productData.description);
  }

  // Append image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (productId: string, productData: any, imageFile?: File) => {
  const formData = new FormData();

  // Append all product fields
  formData.append('productName', productData.productName);
  formData.append('itemCode', productData.itemCode);
  formData.append('price', productData.price.toString());
  formData.append('discount', (productData.discount || 0).toString());
  formData.append('itemMasterId', productData.itemMasterId);

  if (productData.description) {
    formData.append('description', productData.description);
  }

  // Append image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await api.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// Categories
export const getAllCategories = async () => {
  const response = await api.get('/item-master');
  return response.data;
};

export const createCategory = async (categoryData: any) => {
  const response = await api.post('/item-master', { name: categoryData.name || categoryData.itemName });
  return response.data;
};

export const updateCategory = async (categoryId: string, categoryData: any) => {
  const response = await api.put(`/item-master/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete(`/item-master/${categoryId}`);
  return response.data;
};

// Bills
export const createBill = async (billData: any) => {
  const response = await api.post('/bills', billData);
  return response.data;
};

export const getAllBills = async () => {
  const response = await api.get('/bills');
  return response.data;
};

export const getBillById = async (billId: string) => {
  const response = await api.get(`/bills/${billId}`);
  return response.data;
};

export const deleteBill = async (billId: string) => {
  const response = await api.delete(`/bills/${billId}`);
  return response.data;
};
