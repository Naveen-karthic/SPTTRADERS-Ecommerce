import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const OrdersManagement: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-primary">Order Management</h2>
      </div>
      <div className="premium-card p-12 text-center space-y-4">
        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-primary">No new orders yet</h3>
        <p className="text-text-muted">Orders will appear here once customers start purchasing.</p>
      </div>
    </div>
  );
};

export default OrdersManagement;
