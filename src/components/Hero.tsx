import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Sprout } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Category Menu - Small Size */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Grocery Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/module/grocery/categories')}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold text-lg">Grocery</span>
          </motion.button>

          {/* Fertilizer Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/module/fertilizer/categories')}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
          >
            <Sprout className="w-5 h-5" />
            <span className="font-bold text-lg">Fertilizer</span>
          </motion.button>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Welcome to <span className="text-indigo-600">SPT Traders</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Your one-stop shop for quality groceries and fertilizers
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
