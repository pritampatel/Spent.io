
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowRight, History, Sparkles, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction, Profile, Budget } from '../types';
import TransactionCard from '../components/TransactionCard';
import { CATEGORIES } from '../constants';

const m = motion as any;

interface Props {
  transactions: Transaction[];
  activeProfile: Profile;
  budgets: Budget[];
  onDeleteTransaction: (id: string) => void;
}

const Home: React.FC<Props> = ({ transactions, activeProfile, budgets, onDeleteTransaction }) => {
  const navigate = useNavigate();
  const totalBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 py-4 space-y-8"
    >
      <m.section variants={item} className="relative group">
        <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative h-64 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">Total Portfolio</p>
              <h1 className="text-5xl font-black tracking-tighter leading-none">
                {activeProfile.currency}{totalBalance.toLocaleString()}
              </h1>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
              <Wallet size={24} className="text-indigo-300" />
            </div>
          </div>

          <div className="relative z-10 flex gap-6">
            <div className="flex-1 p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight size={10} className="text-emerald-400" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Income</span>
              </div>
              <p className="text-lg font-black text-emerald-400">+{activeProfile.currency}{income.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <ArrowDownRight size={10} className="text-orange-400" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Spending</span>
              </div>
              <p className="text-lg font-black text-orange-400">-{activeProfile.currency}{expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </m.section>

      <section className="grid grid-cols-2 gap-4">
        <m.div
          variants={item}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/analysis')}
          className="bg-white p-6 rounded-[2rem] soft-shadow border border-slate-50 flex flex-col justify-between aspect-square group"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-12">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Financial Health</p>
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-3xl font-black text-slate-800">84</h4>
              <span className="text-sm font-bold text-slate-300">/ 100</span>
            </div>
          </div>
        </m.div>

        <m.div
          variants={item}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/budgets')}
          className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between aspect-square relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl -translate-x-4 translate-y-4" />
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm transition-transform group-hover:scale-110">
            <CreditCard size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Budgets</p>
            <h4 className="text-2xl font-black text-slate-800">2 Active</h4>
          </div>
        </m.div>
      </section>

      <m.section
        variants={item}
        className="relative bg-white rounded-[2rem] p-6 flex items-center gap-5 border border-indigo-50 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.1)] group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 animate-pulse" />
          <div className="relative w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <Sparkles size={22} />
          </div>
        </div>
        <div className="flex-1">
          <h5 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1">Smart Insight</h5>
          <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
            "Your weekend spending is slightly higher than average. Save 10% more this week?"
          </p>
        </div>
      </m.section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quick Filters</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((cat) => (
            <m.div 
              whileTap={{ scale: 0.95 }}
              key={cat} 
              className="flex-shrink-0 bg-white p-4 rounded-[1.75rem] border border-slate-100 soft-shadow flex flex-col items-center gap-3 min-w-[95px] hover:border-indigo-100 transition-colors"
            >
              <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center ${CATEGORIES[cat].color}`}>
                {CATEGORIES[cat].icon}
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{cat}</span>
            </m.div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History size={16} className="text-slate-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity</h3>
          </div>
          <button 
            onClick={() => navigate('/history')}
            className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full"
          >
            See All <ArrowRight size={10} />
          </button>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {transactions.slice(0, 5).map((tx) => (
              <TransactionCard 
                key={tx.id}
                transaction={tx} 
                currency={activeProfile.currency}
                onDelete={onDeleteTransaction}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      <div className="h-10" />
    </m.div>
  );
};

export default Home;
