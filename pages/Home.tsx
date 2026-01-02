
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowRight, 
  History, 
  Sparkles, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction, Profile, Budget } from '../types';
import TransactionCard from '../components/TransactionCard';

const m = motion as any;

interface Props {
  transactions: Transaction[];
  activeProfile: Profile;
  budgets: Budget[];
  onDeleteTransaction: (id: string) => void;
}

const Home: React.FC<Props> = ({ transactions, activeProfile, budgets, onDeleteTransaction }) => {
  const navigate = useNavigate();
  
  const metrics = useMemo(() => {
    const totalBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { totalBalance, income, expenses };
  }, [transactions]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 space-y-5 pt-2"
    >
      {/* Super Compact Prime Portfolio Card */}
      <section className="relative pt-1">
        <div className="absolute inset-x-0 top-0 h-32 bg-indigo-600 rounded-[2rem] blur-[50px] opacity-10 pointer-events-none" />
        <div className="relative bg-slate-950 rounded-[2.5rem] p-5 text-white shadow-2xl flex flex-col gap-5 overflow-hidden border border-white/5">
          <div className="absolute -top-24 -right-24 w-[280px] h-[280px] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-[70px]" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                  <ShieldCheck size={8} className="text-white" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Vault Protocol</span>
              </div>
              <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
            
            <div className="space-y-0">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Net Assets</p>
              <h1 className="text-4xl font-black tracking-tighter leading-none flex items-start gap-1">
                <span className="text-lg font-medium text-white/30 mt-0.5">{activeProfile.settings.currency}</span>
                {metrics.totalBalance.toLocaleString()}
              </h1>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2.5">
            <m.div 
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/5 backdrop-blur-3xl rounded-[1.25rem] border border-white/5 flex items-center gap-3"
            >
              <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
                <ArrowUpRight size={12} />
              </div>
              <div>
                <span className="text-[6px] font-black uppercase tracking-widest text-white/30 block">Inflow</span>
                <p className="text-[13px] font-black text-white">+{activeProfile.settings.currency}{metrics.income.toLocaleString()}</p>
              </div>
            </m.div>
            <m.div 
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/5 backdrop-blur-3xl rounded-[1.25rem] border border-white/5 flex items-center gap-3"
            >
              <div className="w-7 h-7 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                <ArrowDownRight size={12} />
              </div>
              <div>
                <span className="text-[6px] font-black uppercase tracking-widest text-white/30 block">Outflow</span>
                <p className="text-[13px] font-black text-white">-{activeProfile.settings.currency}{metrics.expenses.toLocaleString()}</p>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Strategic AI Pulse - Compact */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
           <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Alpha Intel</h3>
        </div>
        <m.div
          whileHover={{ y: -1 }}
          onClick={() => navigate('/analysis')}
          className="bg-white rounded-[1.75rem] p-4 border border-slate-50 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer"
        >
          <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
             <Zap size={18} className="fill-indigo-400 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-800 leading-snug truncate">
              "Burn rate is <span className="text-indigo-600">stable</span>. Trends suggest <span className="text-emerald-600">+12% growth</span>."
            </p>
          </div>
          <ChevronRight size={14} className="text-slate-200" />
        </m.div>
      </section>

      {/* Ledger Feed */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History size={12} className="text-slate-300" />
            <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger</h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx) => (
                <TransactionCard 
                  key={tx.id}
                  transaction={tx} 
                  currency={activeProfile.settings.currency}
                  onDelete={onDeleteTransaction}
                />
              ))
            ) : (
              <div className="py-10 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <CreditCard size={20} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Empty Vault</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="h-20" />
    </m.div>
  );
};

export default Home;
