
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  X, 
  ChevronDown, 
  History,
  DollarSign,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Budget, Transaction, CategoryType } from '../types';
import { CATEGORIES, getCategoryMeta } from '../constants';
import { format } from 'date-fns';

const m = motion as any;

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  currency: string;
  onUpdateBudget: (cat: CategoryType, limit: number) => void;
}

const Budgets: React.FC<Props> = ({ transactions, budgets, currency, onUpdateBudget }) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState('');
  
  const longPressTimer = useRef<any>(null);

  const allCategories = Array.from(new Set([
    ...Object.keys(CATEGORIES),
    ...budgets.map(b => b.category)
  ]));

  const getSpent = (cat: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getRecentTransactions = (cat: string) => {
    return transactions
      .filter(t => t.category === cat)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatLimit) return;
    onUpdateBudget(newCatName, parseFloat(newCatLimit));
    setNewCatName('');
    setNewCatLimit('');
    setIsAddModalOpen(false);
  };

  const handleTouchStart = (cat: string) => {
    longPressTimer.current = setTimeout(() => {
      setNewCatName(cat);
      const existingBudget = budgets.find(b => b.category === cat);
      setNewCatLimit(existingBudget ? existingBudget.limit.toString() : '');
      setIsAddModalOpen(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <m.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="px-6 py-4 space-y-10 relative"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-slate-900 text-white rounded-[1.25rem] shadow-xl shadow-slate-200">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Budgets</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Strategic Guardrails</p>
          </div>
        </div>
        <m.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setNewCatName('');
            setNewCatLimit('');
            setIsAddModalOpen(true);
          }}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={24} strokeWidth={3} />
        </m.button>
      </header>

      <div className="space-y-6">
        {allCategories.map((cat) => {
          const budget = budgets.find(b => b.category === cat);
          const spent = getSpent(cat);
          const limit = budget?.limit || 0;
          const meta = getCategoryMeta(cat);
          const recent = getRecentTransactions(cat);
          
          const actualPercentage = limit > 0 ? (spent / limit) * 100 : 0;
          const displayPercentage = Math.min(actualPercentage, 100);
          
          const isCritical = limit > 0 && actualPercentage >= 100;
          const isWarning = limit > 0 && actualPercentage >= 80 && actualPercentage < 100;
          const isHealthy = limit > 0 && actualPercentage < 80;

          const statusColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#6366f1';
          const statusText = isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-indigo-600';
          const isExpanded = expandedCat === cat;

          return (
            <m.div 
              layout
              key={cat} 
              onMouseDown={() => handleTouchStart(cat)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onTouchStart={() => handleTouchStart(cat)}
              onTouchEnd={handleTouchEnd}
              className={`group bg-white rounded-[2.5rem] p-7 border transition-all duration-500 soft-shadow active:scale-[0.98] cursor-pointer ${isCritical ? 'border-red-100' : isWarning ? 'border-amber-100' : 'border-slate-50 hover:border-indigo-100'}`}
              onClick={() => setExpandedCat(isExpanded ? null : cat)}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                      {cat}
                    </h4>
                    <div className="mt-1">
                      {isCritical ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black bg-red-100 text-red-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <AlertCircle size={10} /> Critical
                        </span>
                      ) : isWarning ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <AlertTriangle size={10} /> Warning
                        </span>
                      ) : limit > 0 ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <CheckCircle2 size={10} /> Healthy
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          No Goal
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="flex flex-col items-end mr-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Progress</span>
                    <span className={`text-sm font-black tracking-tighter ${statusText}`}>
                      {limit > 0 ? `${actualPercentage.toFixed(0)}%` : '—'}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 px-1">
                  <div className="bg-slate-50/50 p-4 rounded-[1.75rem] border border-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Budget Limit</p>
                    <p className="text-base font-black text-slate-700 tracking-tighter">
                      {currency}{limit.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-[1.75rem] border border-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Utilization</p>
                    <p className={`text-base font-black tracking-tighter ${statusText}`}>
                      {limit > 0 ? `${actualPercentage.toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Spent in {cat}</span>
                    <span className={`text-xl font-black tracking-tighter ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>
                      {currency}{spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <m.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${displayPercentage}%`, backgroundColor: statusColor }}
                      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <m.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-6 border-t border-slate-50 mt-4 overflow-hidden"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                          <History size={14} className="text-slate-400" />
                          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Recent Log</h5>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {recent.length > 0 ? (
                          recent.map(tx => (
                            <m.div 
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              key={tx.id} 
                              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                  <Clock size={16} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-slate-800 leading-none mb-1.5">{tx.description}</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{format(new Date(tx.date), 'MMMM dd')}</p>
                                    <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${tx.type === 'expense' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                      {tx.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className={`text-[12px] font-black ${tx.type === 'expense' ? 'text-slate-900' : 'text-emerald-500'}`}>
                                {tx.type === 'expense' ? '-' : '+'}{currency}{tx.amount.toLocaleString()}
                              </span>
                            </m.div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                            <TrendingDown size={24} className="mx-auto mb-2 text-slate-200" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Activity Yet</p>
                          </div>
                        )}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          );
        })}
      </div>

      <div className="text-center opacity-30 px-10">
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Tip: Hold card to adjust limit</p>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <m.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-t-[3.5rem] sm:rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-100 rounded-full" />
              
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Set Budget</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <X size={22} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Target Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Travel, Gym, Coffee"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-base font-bold outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner"
                    required
                  />
                </div>

                <div className="space-y-4 text-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Monthly Limit</label>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <DollarSign size={28} strokeWidth={3} />
                    </div>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      autoFocus
                      value={newCatLimit}
                      onChange={e => setNewCatLimit(e.target.value)}
                      className="w-48 text-6xl font-black text-slate-900 bg-transparent border-none text-center focus:ring-0 placeholder:text-slate-100 tracking-tighter"
                      required
                    />
                  </div>
                </div>

                <m.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.25em] text-sm shadow-2xl"
                >
                  Deploy Strategy
                </m.button>
              </form>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </m.div>
  );
};

export default Budgets;
