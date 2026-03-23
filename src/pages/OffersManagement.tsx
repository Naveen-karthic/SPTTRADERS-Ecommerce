import React from 'react';
import { 
  Tag, 
  Plus, 
  Calendar, 
  Percent, 
  Sparkles, 
  Trash2, 
  Edit2,
  Image as ImageIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const OffersManagement: React.FC = () => {
  const currentOffers = [
    { title: 'Summer Bonanza', discount: '20% OFF', category: 'Rice', status: 'Active', expiry: '24 Mar 2026' },
    { title: 'New User Deal', discount: '₹100 Flat', category: 'SPT Brand', status: 'Scheduled', expiry: '01 Apr 2026' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary tracking-tight text-gradient">Promotions Hub</h2>
          <p className="text-text-muted font-medium">Manage your banners, discounts, and flash sales.</p>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-3 shadow-xl shadow-primary/20 hover:bg-primary-light transition-all active:scale-95 text-xs uppercase tracking-widest">
          <Plus className="w-5 h-5 text-accent" />
          <span>New Promotion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Offer Creator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-10 bg-accent shadow-indigo-500/20 border-accent/20 text-white relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner">
              <Percent className="w-8 h-8 text-white animate-floating" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Flash Sale Builder</h3>
              <p className="text-white/70 text-sm font-medium">Instantly launch a store-wide or category-specific discount.</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Offer Title" 
                  className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm font-bold placeholder:text-white/40 focus:bg-white/20 outline-none transition-all"
                />
                <input 
                  type="text" 
                  placeholder="Discount %" 
                  className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm font-bold placeholder:text-white/40 focus:bg-white/20 outline-none transition-all"
                />
              </div>
              <button className="w-full bg-white text-accent py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-50 transition-all">
                Launch Offer Now
              </button>
            </div>
          </div>
          <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
        </motion.div>

        {/* Stats / Tracking Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-10 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-primary">Live Impact</h3>
            <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">Real-time</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-background border border-border/50 space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Clicks</p>
              <h4 className="text-3xl font-black text-primary">2.4k</h4>
            </div>
            <div className="p-6 rounded-3xl bg-background border border-border/50 space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Conversions</p>
              <h4 className="text-3xl font-black text-secondary">₹12.5k</h4>
            </div>
          </div>

          <div className="bg-success/5 border border-success/20 p-6 rounded-3xl flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-black text-primary">Your last offer generated 15% more sales!</p>
              <p className="text-xs text-text-muted font-bold">Automatic insight from ML models.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Offers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="premium-card overflow-hidden"
      >
        <div className="p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-primary">Active Promotions</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Currently visible to customers</p>
          </div>
          <div className="flex bg-background p-1.5 rounded-2xl border border-border/50">
            <button className="px-6 py-2 rounded-xl text-xs font-black bg-white shadow-lg shadow-black/5">Active</button>
            <button className="px-6 py-2 rounded-xl text-xs font-black text-text-muted">History</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Promotion</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Benefit</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {currentOffers.map((offer, i) => (
                <tr key={i} className="group hover:bg-background/20 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center text-accent shadow-lg group-hover:rotate-12 transition-transform">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-black text-primary">{offer.title}</p>
                        <div className="flex items-center space-x-1.5 text-[10px] text-text-muted font-black tracking-widest">
                          <Clock className="w-3 h-3" />
                          <span>EXP {offer.expiry}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-secondary uppercase bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/10 tracking-widest">
                      {offer.discount}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-primary">
                    {offer.category}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <span className={`w-2 h-2 rounded-full ${offer.status === 'Active' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                       <span className="text-xs font-black uppercase tracking-widest">{offer.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 glass-premium rounded-xl text-primary hover:text-accent transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 glass-premium rounded-xl text-danger hover:bg-danger/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default OffersManagement;
