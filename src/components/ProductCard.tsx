import React from 'react';
import { ShoppingCart, Plus, Minus, Tag, Heart, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  name: string;
  itemCode: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, itemCode, price, oldPrice, discount, image }) => {
  const [quantity, setQuantity] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="premium-card group relative flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.5rem]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2.5 glass-premium rounded-xl shadow-lg transition-transform hover:scale-110 active:scale-90 z-20"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-secondary text-secondary' : 'text-primary'}`} />
        </button>

        {discount && (
          <div className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-secondary/30 flex items-center space-x-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{discount}% OFF</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 glass-premium px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
          <Star className="w-3 h-3 text-warning fill-warning" />
          <span className="text-[10px] font-bold">4.8</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{itemCode}</p>
          <h3 className="text-xl font-black text-primary leading-tight line-clamp-2">{name}</h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary leading-none">₹{price}</span>
            {oldPrice && (
              <span className="text-xs text-text-muted line-through font-medium mt-1">₹{oldPrice}</span>
            )}
          </div>

          <div className="relative h-12 w-32">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button 
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuantity(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-full glass-premium rounded-2xl flex items-center justify-center space-x-2 text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 font-bold shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add</span>
                </motion.button>
              ) : (
                <motion.div 
                  key="quantity-box"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-between w-full h-full bg-accent rounded-2xl p-1 shadow-lg shadow-accent/30"
                >
                  <button 
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4 font-bold" />
                  </button>
                  <span className="text-white font-black text-sm w-10 text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 font-bold" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
