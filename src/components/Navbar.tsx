import React from 'react';
import { ShoppingCart, User, Search, Menu, Sparkles, LogOut, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Offers', path: '/offers' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-premium rounded-[2rem] px-8 py-3 flex items-center justify-between shadow-2xl border-white/40 transition-all ${
          isScrolled ? 'mx-4' : ''
        }`}>
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-accent p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-primary">
              SPT<span className="text-accent underline decoration-4 decoration-accent/30">TRADERS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-all hover:text-accent relative py-1 ${
                  location.pathname === link.path ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
            {/* Admin Dashboard Link - Only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-bold transition-all hover:text-accent relative py-1 flex items-center gap-1 ${
                  location.pathname.startsWith('/admin') ? 'text-secondary' : 'text-text-muted'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
                {location.pathname.startsWith('/admin') && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full"
                  />
                )}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative group">
              <input 
                type="text" 
                placeholder="Find perfection..." 
                className="pl-10 pr-4 py-2.5 bg-background/50 border border-border/50 rounded-2xl w-48 focus:w-64 focus:ring-2 focus:ring-accent transition-all outline-none text-sm font-medium"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            </div>
            
            <Link to="/cart" className="relative p-2.5 glass-premium rounded-xl text-text-muted hover:text-accent transition-all hover:scale-110 active:scale-95">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-secondary/30">
                2
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-text-main">{user?.name}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-secondary text-white px-4 py-2.5 rounded-2xl hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/10 active:scale-95 font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/10 active:scale-95 font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            <button className="lg:hidden p-2 text-primary">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
