import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import LoginPageNew from './pages/LoginPageNew';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import ModuleCategoriesPage from './pages/ModuleCategoriesPage';
import ModuleCategoryProductsPage from './pages/ModuleCategoryProductsPage';
import AdminDashboard from './pages/AdminDashboardNew';
import ProductManagement from './pages/ProductManagement';
import FertilizerInventory from './pages/FertilizerInventory';
import ProductForm from './pages/ProductForm';
import OffersManagement from './pages/OffersManagement';
import OrdersManagement from './pages/OrdersManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import UserManagement from './pages/UserManagement';
import Billing from './pages/Billing';
import BillDetail from './pages/BillDetail';
import BusinessSettingsPage from './pages/BusinessSettingsPage';
import CategoriesPage from './pages/CategoriesPage';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/inventory');
  const isModulePage = location.pathname.startsWith('/module');

  return (
    <div className="min-h-screen text-text-main relative selection:bg-accent selection:text-white">
      <div className="mesh-bg" />
      {!isAdminPath && !isModulePage && <Navbar />}
      <main className={`${!isAdminPath && !isModulePage ? 'max-w-7xl mx-auto px-6 pt-32 pb-20' : 'p-0'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-old" element={<LoginPage />} />
          <Route path="/login" element={<LoginPageNew />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />

          {/* Module Routes */}
          <Route path="/module/:moduleType/categories" element={<ModuleCategoriesPage />} />
          <Route path="/module/:moduleType/category/:categoryName" element={<ModuleCategoryProductsPage />} />

          {/* Admin Routes with Layout - Protected by Admin Role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/grocery"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><ProductManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/fertilizer"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><FertilizerInventory /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:productId"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><OffersManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><OrdersManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AnalyticsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><UserManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><Billing /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <BillDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/business"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BusinessSettingsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/categories"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><CategoriesPage /></AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
