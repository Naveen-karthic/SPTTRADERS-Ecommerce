import React from 'react';
import { ShoppingCart, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import CategoriesSection from '../components/CategoriesSection';

const CATEGORIES = ["All", "SPT Brand", "Rice", "Sweeteners", "Dry Fruits", "Oils", "Groceries"];

const MOCK_PRODUCTS = [
  {
    name: "Pure Basmati Rice",
    itemCode: "38631848442",
    price: 60,
    oldPrice: 80,
    discount: 25,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Organic Honey",
    itemCode: "49201938472",
    price: 150,
    oldPrice: 180,
    discount: 16,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Cold Pressed Olive Oil",
    itemCode: "50293847281",
    price: 450,
    oldPrice: 500,
    discount: 10,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbad93c5?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Premium Almonds",
    itemCode: "61203948572",
    price: 320,
    oldPrice: 400,
    discount: 20,
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&q=80&w=400"
  }
];

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <Hero />

      {/* Grocery Style Categories Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <CategoriesSection />
      </div>

      {/* Categories & Products Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-accent font-black tracking-widest uppercase text-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Browse Catalog</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-primary">Our Collections</h2>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                  selectedCategory === category 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20 border-accent' 
                    : 'bg-white/50 text-text-muted hover:bg-white border-white/40'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.itemCode}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Cart Bar (Premium Version) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl glass-premium rounded-[2.5rem] p-4 shadow-2xl border border-white/50 flex items-center justify-between z-40"
      >
        <div className="flex items-center space-x-6 px-4">
          <div className="relative">
            <div className="bg-accent p-3 rounded-2xl shadow-xl shadow-accent/20">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              2
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-primary uppercase tracking-tight">₹150.00</p>
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Express Delivery Ready</p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary text-white px-10 py-4 rounded-[2rem] font-black shadow-2xl hover:bg-primary-light transition-all flex items-center space-x-3 uppercase text-xs tracking-widest"
        >
          <span>Checkout</span>
          <Sparkles className="w-4 h-4 text-warning" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
