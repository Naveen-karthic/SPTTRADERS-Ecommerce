import React from 'react';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const [items, setItems] = React.useState([
    { id: 1, name: 'Pure Basmati Rice', price: 60, quantity: 2, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Cold Pressed Olive Oil', price: 450, quantity: 1, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbad93c5?auto=format&fit=crop&q=80&w=400' },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-primary mb-8">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="premium-card p-4 flex items-center space-x-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-primary">{item.name}</h3>
                <p className="text-accent font-bold">₹{item.price}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center bg-background border border-border rounded-lg p-1">
                    <button className="p-1 hover:bg-surface rounded-md text-text-muted"><Minus className="w-4 h-4" /></button>
                    <span className="px-3 font-bold text-sm">{item.quantity}</span>
                    <button className="p-1 hover:bg-surface rounded-md text-text-muted"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button className="text-danger flex items-center space-x-1 text-xs font-bold uppercase tracking-wider hover:opacity-70">
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-primary">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-12 text-center bg-surface border border-dashed border-border rounded-3xl">
              <p className="text-text-muted mb-4">Your cart is empty</p>
              <Link to="/" className="text-accent font-bold hover:underline">Continue Shopping</Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="premium-card p-8 space-y-6 bg-primary text-white">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="space-y-4 text-sm opacity-90">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-success font-bold">FREE</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold opacity-100">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
            <button className="w-full bg-accent text-white py-4 rounded-2xl font-bold hover:bg-accent-light transition-all shadow-xl shadow-accent/20 flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Checkout Now</span>
            </button>
          </div>
          
          <p className="text-center text-xs text-text-muted font-medium px-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
