import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-primary">Deep Analytics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Weekly Growth', value: '+14%', icon: TrendingUp },
          { label: 'Cust. Retention', value: '82%', icon: Users },
          { label: 'Avg. Order', value: '₹840', icon: DollarSign },
          { label: 'Market Share', value: '12%', icon: BarChart3 },
        ].map((s, i) => (
          <div key={i} className="premium-card p-6 space-y-2">
            <s.icon className="w-6 h-6 text-accent" />
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{s.label}</p>
            <h4 className="text-2xl font-black text-primary">{s.value}</h4>
          </div>
        ))}
      </div>
      <div className="premium-card p-12 text-center">
        <p className="text-text-muted font-bold tracking-widest uppercase">Analytics Data Processing...</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
