
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, ArrowLeft, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../types';
import TransactionCard from '../components/TransactionCard';
import { format } from 'date-fns';

const m = motion as any;

interface Props {
  transactions: Transaction[];
  currency: string;
  onDeleteTransaction: (id: string) => void;
}

const HistoryPage: React.FC<Props> = ({ transactions, currency, onDeleteTransaction }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || t.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, selectedType]);

  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 py-4 space-y-6"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <m.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white rounded-xl soft-shadow flex items-center justify-center text-slate-800"
          >
            <ArrowLeft size={20} />
          </m.button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Activity Log</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Historical Data</p>
          </div>
        </div>
        <button className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
          <Download size={18} />
        </button>
      </header>

      <div className="space-y-4">
        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-800 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 transition-all soft-shadow outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {['all', 'expense', 'income'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === type ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <TransactionCard 
                key={tx.id}
                transaction={tx} 
                currency={currency} 
                onDelete={onDeleteTransaction} 
              />
            ))
          ) : (
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <Search size={24} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching results</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-10" />
    </m.div>
  );
};

export default HistoryPage;
