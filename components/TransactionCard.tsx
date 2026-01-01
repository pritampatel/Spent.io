
import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const m = motion as any;

interface Props {
  transaction: Transaction;
  currency: string;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, currency, onDelete }) => {
  const category = CATEGORIES[transaction.category] || CATEGORIES['Other'];
  const isExpense = transaction.type === 'expense';

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ 
        opacity: 0, 
        x: -60, 
        scale: 0.9, 
        filter: 'blur(10px)',
        transition: { 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        } 
      }}
      whileHover={{ y: -4, scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        mass: 0.8,
        layout: { duration: 0.35, ease: "easeInOut" }
      }}
      className="relative flex items-center justify-between p-4 bg-white rounded-[2rem] border border-slate-50 soft-shadow group overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <m.div
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${category.color} group-hover:scale-110`}
        >
          {React.cloneElement(category.icon as React.ReactElement<any>, { size: 24 })}
        </m.div>
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
          <m.span
            initial={false}
            animate={{ scale: [1, 1.05, 1] }}
            className={`text-base font-black tracking-tighter ${isExpense ? 'text-slate-900' : 'text-emerald-500'}`}
          >
            {isExpense ? '-' : '+'}{currency}{transaction.amount.toLocaleString()}
          </m.span>
          <ChevronRight size={14} className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 flex items-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out bg-red-50/90 backdrop-blur-md px-4 border-l border-red-100">
           <m.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </m.button>
        </div>
      </div>
    </m.div>
  );
};

export default TransactionCard;
