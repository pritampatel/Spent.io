
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-between p-5 bg-white rounded-[2.25rem] border border-slate-50 shadow-sm group overflow-hidden cursor-pointer"
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${category.color}`}>
          {React.cloneElement(category.icon as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[15px] font-black text-slate-900 leading-tight">{transaction.description}</h4>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {transaction.category}
            </span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
              {format(new Date(transaction.date), 'MMM dd')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <m.span
          className={`text-[16px] font-black tracking-tight ${isExpense ? 'text-slate-950' : 'text-emerald-600'}`}
        >
          {isExpense ? '-' : '+'}{currency}{transaction.amount.toLocaleString()}
        </m.span>
        
        {/* Swipe-to-delete indicator for mobile feel */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out bg-slate-950/5 backdrop-blur-md px-4">
           <m.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </m.button>
        </div>
      </div>
    </m.div>
  );
};

export default TransactionCard;
