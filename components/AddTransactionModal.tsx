
import React, { useState } from 'react';
import { X, Check, DollarSign, Wallet, CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CategoryType, Transaction } from '../types';
import { CATEGORIES } from '../constants';

const m = motion as any;

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
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white rounded-t-[4rem] p-10 shadow-2xl max-h-[95vh] overflow-y-auto no-scrollbar"
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-slate-100 rounded-full" />

            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">New Entry</h3>
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl"
              >
                <X size={20} strokeWidth={3} />
              </m.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Type Switch */}
              <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${type === t ? 'text-white' : 'text-slate-400'}`}
                  >
                    {type === t && (
                      <m.div
                        layoutId="type-active" 
                        className="absolute inset-0 bg-slate-950 rounded-[2rem] shadow-xl" 
                      />
                    )}
                    <span className="relative z-10">{t}</span>
                  </button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Capital Flow</p>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${type === 'expense' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                    <DollarSign size={28} strokeWidth={3} />
                  </div>
                  <input 
                    type="number"
                    autoFocus
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-56 bg-transparent border-none text-7xl font-black text-slate-950 placeholder:text-slate-100 focus:ring-0 text-center tracking-tighter"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-4">
                   <CreditCard size={14} className="text-slate-400" />
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ledger Description</label>
                </div>
                <input 
                  type="text"
                  placeholder="Detail the transaction..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2.25rem] text-lg font-bold text-slate-900 focus:bg-white focus:border-indigo-100 transition-all outline-none"
                />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-4">
                   <Wallet size={14} className="text-slate-400" />
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Classify Category</label>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {(Object.keys(CATEGORIES) as CategoryType[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all ${category === cat ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-50 bg-slate-50'}`}
                    >
                      <div className={`p-3 rounded-2xl mb-2 transition-transform ${category === cat ? 'scale-110 ' + CATEGORIES[cat].color : 'opacity-30'}`}>
                        {React.cloneElement(CATEGORIES[cat].icon as React.ReactElement<any>, { size: 18, strokeWidth: 3 })}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest truncate w-full text-center ${category === cat ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <m.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 group"
              >
                Secure Entry
                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
                   <Check size={16} strokeWidth={3} />
                </div>
              </m.button>
            </form>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;
