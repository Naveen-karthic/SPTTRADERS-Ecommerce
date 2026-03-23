import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹48,250', trend: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-success' },
    { label: 'Active Users', value: '1,240', trend: '+5.2%', isUp: true, icon: Users, color: 'text-accent' },
    { label: 'Total Products', value: '312', trend: '-2.1%', isUp: false, icon: Package, color: 'text-warning' },
    { label: 'Pending Orders', value: '18', trend: '+3', isUp: true, icon: ShoppingBag, color: 'text-secondary' },
  ];

  const recentOrders = [
    { id: '#12839', user: 'Shobik', amount: '₹450', status: 'Delivered', time: '2 mins ago' },
    { id: '#12840', user: 'Anand', amount: '₹1,200', status: 'Pending', time: '15 mins ago' },
    { id: '#12841', user: 'Manoj', amount: '₹890', status: 'Processing', time: '1 hour ago' },
    { id: '#12842', user: 'Vijay', amount: '₹2,100', status: 'Cancelled', time: '3 hours ago' },
  ];

  const activity = [
    { icon: Package, text: 'Inventory low: Basmati Rice', time: '12:45 PM', type: 'warning' },
    { icon: CheckCircle2, text: 'Payout successful', time: '11:20 AM', type: 'success' },
    { icon: AlertCircle, text: 'Server load: High', time: '10:05 AM', type: 'danger' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary tracking-tight">Analytics Overview</h2>
          <p className="text-text-muted font-medium">Welcome back, Shobi. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="glass-premium p-3 rounded-2xl text-text-muted hover:text-primary transition-all shadow-md">
            <Download className="w-5 h-5" />
          </button>
          <button className="glass-premium p-3 rounded-2xl text-text-muted hover:text-primary transition-all shadow-md relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-primary/20 hover:bg-primary-light transition-all active:scale-95">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-background/50 border border-border/50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-black ${stat.isUp ? 'text-success' : 'text-danger'}`}>
                <span>{stat.trend}</span>
                {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-primary">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 premium-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-primary">Revenue Timeline</h3>
              <p className="text-xs text-text-muted font-bold tracking-widest">LAST 7 DAYS PERFORMANCE</p>
            </div>
            <div className="flex bg-background p-1 rounded-xl border border-border/50">
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white shadow-sm border border-border/50">Weekly</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-text-muted">Monthly</button>
            </div>
          </div>

          {/* Custom SVG Chart Placeholder (Looks Premium) */}
          <div className="h-64 relative w-full group">
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 0,80 Q 50,20 100,50 T 200,30 T 300,60 T 400,10" 
                fill="none" 
                stroke="var(--accent)" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <path d="M 0,80 Q 50,20 100,50 T 200,30 T 300,60 T 400,10 V 100 H 0 Z" fill="url(#chartGradient)" />
              
              {/* Data points */}
              {[
                { x: 0, y: 80 }, { x: 50, y: 20 }, { x: 100, y: 50 }, 
                { x: 200, y: 30 }, { x: 300, y: 60 }, { x: 400, y: 10 }
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2" fill="var(--accent)" className="group-hover:r-3 transition-all" />
              ))}
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-black text-text-muted uppercase tracking-tighter pt-4 opacity-50">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-primary">Live Activity</h3>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-success uppercase">Live</span>
            </span>
          </div>

          <div className="space-y-6">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`p-2 rounded-xl border ${
                  item.type === 'warning' ? 'bg-warning/10 border-warning/20 text-warning' :
                  item.type === 'danger' ? 'bg-danger/10 border-danger/20 text-danger' :
                  'bg-success/10 border-success/20 text-success'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-primary">{item.text}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-text-muted font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:text-accent font-black text-xs uppercase tracking-widest transition-all">
            View All Logs
          </button>
        </motion.div>
      </div>

      {/* Orders Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="premium-card overflow-hidden"
      >
        <div className="p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-primary">Recent Orders</h3>
            <p className="text-xs text-text-muted font-bold">LATEST TRANSACTIONS FROM YOUR STORE</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-3 bg-background border border-border/50 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            </div>
            <button className="glass-premium p-3 rounded-2xl text-text-muted hover:text-primary transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Order Details</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders.map((order, i) => (
                <tr key={order.id} className="group hover:bg-background/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-primary">{order.id}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">{order.time}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-black">
                        {order.user.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-primary">{order.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-black text-primary">{order.amount}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-success/10 text-success' :
                      order.status === 'Pending' ? 'bg-warning/10 text-warning' :
                      order.status === 'Cancelled' ? 'bg-danger/10 text-danger' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2.5 glass-premium rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-accent">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-background/30 text-center">
          <button className="text-xs font-black text-accent uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            View All Transactions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
