
import React, { useState } from 'react';
import { X, Check, DollarSign } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CategoryType, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Omit<Transaction, 'id' | 'profileId'>) => void;
}

const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onAdd({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString()
    });
    setAmount('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[12px]"
          />
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[3.5rem] p-10 shadow-[0_-20px_100px_rgba(0,0,0,0.1)] max-h-[92vh] overflow-y-auto no-scrollbar"
          >
            {/* Native-style Grabber */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-slate-100 rounded-full" />

            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add Transaction</h3>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900"
              >
                <X size={22} strokeWidth={2.5} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Modern Type Toggle */}
              <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100 shadow-inner">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all relative ${type === t ? 'text-slate-900' : 'text-slate-400'}`}
                  >
                    {type === t && (
                      <motion.div 
                        layoutId="type-bg" 
                        className="absolute inset-0 bg-white rounded-[2rem] shadow-lg border border-slate-100" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t}</span>
                  </button>
                ))}
              </div>

              {/* Enhanced Amount Input */}
              <div className="text-center group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 block mb-6">Portfolio Impact</label>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-colors shadow-lg ${type === 'expense' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                    <DollarSign size={28} strokeWidth={3} />
                  </div>
                  <input 
                    type="number"
                    autoFocus
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-56 bg-transparent border-none text-6xl font-black text-slate-900 placeholder:text-slate-50 focus:ring-0 text-center tracking-tighter"
                  />
                </div>
              </div>

              {/* Polish Description */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Detailed Description</label>
                <input 
                  type="text"
                  placeholder="Where did the money go?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-base font-bold text-slate-800 focus:bg-white focus:border-indigo-100 focus:shadow-xl focus:shadow-indigo-50/50 transition-all outline-none"
                />
              </div>

              {/* High-Contrast Category Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Select Category</label>
                <div className="grid grid-cols-4 gap-4">
                  {(Object.keys(CATEGORIES) as CategoryType[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all ${category === cat ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className={`p-3.5 rounded-2xl mb-2.5 transition-all ${category === cat ? 'scale-110 shadow-xl ' + CATEGORIES[cat].color : 'opacity-50'}`}>
                        {React.cloneElement(CATEGORIES[cat].icon as React.ReactElement, { size: 20 })}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-tighter truncate w-full text-center ${category === cat ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.25em] text-sm shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 group"
              >
                Confirm Entry
                <div className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <Check size={16} strokeWidth={3} />
                </div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;
