
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  CartesianGrid
} from 'recharts';
import { Sparkles, BrainCircuit, Calendar, Filter, Zap, Info } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { Transaction, Budget } from '../types';
import { CATEGORIES } from '../constants';
import { getAIInsights } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  currency: string;
}

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];

const Analysis: React.FC<Props> = ({ transactions, budgets, currency }) => {
  const [aiTips, setAiTips] = useState<{ tip: string; priority: string }[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const expenses = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const categoryData = useMemo(() => {
    return (Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(cat => {
      const total = expenses
        .filter(t => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat, value: total };
    }).filter(d => d.value > 0);
  }, [expenses]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const targetDate = subDays(new Date(), 6 - i);
      const dayTotal = expenses
        .filter(t => isSameDay(new Date(t.date), targetDate))
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        day: format(targetDate, 'EEE'),
        amount: dayTotal
      };
    });
  }, [expenses]);

  const fetchAI = async () => {
    if (transactions.length === 0) return;
    setLoadingAI(true);
    const tips = await getAIInsights(transactions, budgets);
    setAiTips(tips);
    setLoadingAI(false);
  };

  useEffect(() => {
    if (transactions.length > 2 && aiTips.length === 0) {
      fetchAI();
    }
  }, [transactions.length]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 backdrop-blur-2xl text-white px-5 py-4 rounded-[1.5rem] shadow-2xl border border-white/10"
        >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
            {payload[0].name || payload[0].payload.day} Breakdown
          </p>
          <p className="text-2xl font-black tracking-tighter">{currency}{payload[0].value.toLocaleString()}</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="px-6 py-4 space-y-10"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Analysis</h2>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Usage & Performance</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-white rounded-2xl soft-shadow text-slate-400 border border-slate-50"
        >
          <Filter size={20} />
        </motion.button>
      </header>

      {/* Hero Interactive Pie Chart */}
      <section className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] blur-[80px] opacity-5 pointer-events-none" />
        <div className="relative bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Expense Diversification</h4>
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Info size={14} className="text-indigo-600" />
            </div>
          </div>
          
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={6}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => setActiveIndex(null)}
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                      className="transition-all duration-500 cursor-pointer"
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Portfolio Out</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                {currency}{expenses.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-5 mt-12">
            {categoryData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-slate-900">{((d.value / Math.max(expenses.reduce((s, t) => s + t.amount, 0), 1)) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Dashboard Card */}
      <section className="relative">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-xl" />
        <div className="relative bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10">
                  <BrainCircuit size={28} className="text-indigo-400" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">AI Financial Brain</h3>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.25em]">Gemini 3 Intelligence</p>
                </div>
              </div>
              <motion.button 
                whileTap={{ rotate: 180 }}
                onClick={fetchAI}
                disabled={loadingAI}
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-colors disabled:opacity-50"
              >
                <Sparkles size={20} className={loadingAI ? 'animate-spin' : 'text-amber-400'} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {loadingAI ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 py-4"
                  >
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                    ))}
                  </motion.div>
                ) : aiTips.length > 0 ? (
                  aiTips.map((tip, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 bg-white/5 border border-white/10 rounded-[1.75rem] flex gap-5"
                    >
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${tip.priority === 'High' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]' : 'bg-indigo-400'}`} />
                      <p className="text-sm font-bold text-slate-200 leading-relaxed italic opacity-95">"{tip.tip}"</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-30">
                    <Zap size={32} className="mx-auto mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Awaiting Fresh Intelligence</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Spending Trend Over Time */}
      <section className="bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usage Over Time</h4>
              <p className="text-xs font-black text-slate-900 tracking-tight">Last 7 Days</p>
            </div>
          </div>
        </div>
        
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1', textTransform: 'uppercase' }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 10 }} />
              <Bar 
                dataKey="amount" 
                fill="#0f172a" 
                radius={[10, 10, 10, 10]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      <div className="h-20" />
    </motion.div>
  );
};

export default Analysis;
