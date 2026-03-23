import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAdminStats } from '../services/adminService';

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  regularUsers: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminStats();
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = stats
    ? [
        {
          label: 'Total Users',
          value: stats.totalUsers.toString(),
          trend: '+5.2%',
          isUp: true,
          icon: Users,
          color: 'text-indigo-600',
        },
        {
          label: 'Admin Users',
          value: stats.totalAdmins.toString(),
          trend: 'Active',
          isUp: true,
          icon: Settings,
          color: 'text-purple-600',
        },
        {
          label: 'Regular Users',
          value: stats.regularUsers.toString(),
          trend: 'Registered',
          isUp: true,
          icon: Users,
          color: 'text-blue-600',
        },
        {
          label: 'Admin Ratio',
          value: `${((stats.totalAdmins / stats.totalUsers) * 100).toFixed(1)}%`,
          trend: 'Of total',
          isUp: true,
          icon: TrendingUp,
          color: 'text-green-600',
        },
      ]
    : [];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 font-medium">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            onClick={fetchStats}
            disabled={isLoading}
          >
            <Download className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.isUp ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        stat.isUp ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-3 bg-gray-50 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Quick Overview</h3>
              <p className="text-indigo-100 mb-6">
                Manage your e-commerce platform efficiently with these quick actions
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/admin/users"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </a>
                <a
                  href="/admin/products"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Manage Products
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <ArrowUpRight className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  User registration completed
                </p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Product updated</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">System backup completed</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800">API Server</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800">Database</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800">Email Service</p>
              <p className="text-xs text-gray-500">Ready</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
