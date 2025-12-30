
import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Props {
  transaction: Transaction;
  currency: string;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, currency, onDelete }) => {
  const category = CATEGORIES[transaction.category];
  const isExpense = transaction.type === 'expense';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)', transition: { duration: 0.2 } }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 28,
        layout: { duration: 0.3 }
      }}
      className="relative flex items-center justify-between p-4 bg-white rounded-[2rem] border border-slate-50 soft-shadow group overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${category.color} group-hover:scale-105`}
        >
          {React.cloneElement(category.icon as React.ReactElement, { size: 24 })}
        </motion.div>
        <div>
          <h4 className="text-[14px] font-black text-slate-800 leading-tight mb-1">{transaction.description}</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-50 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
              {transaction.category}
            </span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-70">
              {format(new Date(transaction.date), 'MMMM dd')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1">
          <span className={`text-base font-black tracking-tighter ${isExpense ? 'text-slate-900' : 'text-emerald-500'}`}>
            {isExpense ? '-' : '+'}{currency}{transaction.amount.toLocaleString()}
          </span>
          <ChevronRight size={14} className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 flex items-center translate-x-full group-hover:translate-x-0 transition-transform bg-red-50/80 backdrop-blur-sm px-4">
           <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
