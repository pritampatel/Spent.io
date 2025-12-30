
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="px-6 py-4 space-y-8 animate-pulse">
      <div className="h-64 bg-slate-100 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square bg-slate-50 rounded-[2rem]" />
        <div className="aspect-square bg-slate-50 rounded-[2rem]" />
      </div>
      
      <div className="h-20 bg-slate-50 rounded-[2rem]" />
      
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-50 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
