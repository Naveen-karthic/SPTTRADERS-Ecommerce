import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Sidebar Container */}
      <div className="fixed top-0 left-0 h-full p-6 w-80">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow ml-80 min-h-screen flex flex-col">
        {/* Admin Header */}
        <header className="h-24 px-10 flex items-center justify-between border-b border-border/30 bg-white/40 backdrop-blur-xl sticky top-0 z-30">
          <div></div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-primary">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] font-bold text-success uppercase tracking-widest">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-secondary p-0.5 shadow-xl">
                 <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center overflow-hidden">
                   {user?.name ? (
                     <span className="text-lg font-bold text-primary">
                       {user.name.charAt(0).toUpperCase()}
                     </span>
                   ) : (
                     <User className="w-6 h-6 text-primary" />
                   )}
                 </div>
              </div>
              {/* Logout Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-black text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        <footer className="p-10 text-center border-t border-border/20">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            SPT TRADERS MANAGEMENT SUITE v2.0 • BUILT WITH PASSION
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
