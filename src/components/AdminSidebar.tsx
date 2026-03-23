import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Sparkles,
  FileText,
  ChevronDown,
  Building2,
  Layers,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Grocery Inventory', path: '/inventory/grocery', icon: Package },
    { name: 'Fertilizer Inventory', path: '/inventory/fertilizer', icon: Tag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Billing', path: '/admin/billing', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Customers', path: '/admin/users', icon: Users },
  ];

  const settingsSubItems = [
    { name: 'Business Settings', path: '/admin/settings/business', icon: Building2 },
    { name: 'Categories', path: '/admin/settings/categories', icon: Layers },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="glass-premium h-full rounded-[2.5rem] p-6 flex flex-col shadow-2xl border-white/40 border-2">
      <div className="px-4 mb-10">
        <Link to="/admin" className="flex items-center space-x-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-accent/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-primary leading-none">SPT</h1>
          </div>
        </Link>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'text-text-muted hover:bg-white/50 hover:text-primary'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'group-hover:text-accent'} transition-colors`} />
                <span className="text-sm font-black tracking-tight">{item.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-l-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Settings Dropdown */}
        <div className="relative">
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center justify-between space-x-3 px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden group cursor-pointer ${
              location.pathname.startsWith('/admin/settings') || location.pathname.startsWith('/admin/business-settings')
                ? 'bg-primary text-white shadow-xl shadow-primary/20'
                : 'text-text-muted hover:bg-white/50 hover:text-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings className={`w-5 h-5 ${location.pathname.startsWith('/admin/settings') || location.pathname.startsWith('/admin/business-settings') ? 'text-accent' : 'group-hover:text-accent'} transition-colors`} />
              <span className="text-sm font-black tracking-tight">Settings</span>
            </div>
            <motion.div
              animate={{ rotate: settingsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-4 h-4 ${location.pathname.startsWith('/admin/settings') || location.pathname.startsWith('/admin/business-settings') ? 'text-accent' : 'group-hover:text-accent'} transition-colors`} />
            </motion.div>

            {(location.pathname.startsWith('/admin/settings') || location.pathname.startsWith('/admin/business-settings')) && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-l-full"
              />
            )}
          </motion.div>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-6 space-y-2 overflow-hidden"
              >
                {settingsSubItems.map((subItem) => (
                  <Link key={subItem.name} to={subItem.path} onClick={() => setSettingsOpen(false)}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all relative overflow-hidden group ${
                        location.pathname === subItem.path
                          ? 'bg-accent/20 text-accent'
                          : 'text-text-muted hover:bg-white/50 hover:text-primary'
                      }`}
                    >
                      <subItem.icon className={`w-4 h-4 transition-colors`} />
                      <span className="text-xs font-bold tracking-tight">{subItem.name}</span>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="pt-6 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-danger hover:bg-danger/10 transition-all font-black text-sm tracking-tight active:scale-95 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Logout Portal</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
