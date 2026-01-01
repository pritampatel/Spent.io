
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
  Tooltip as RechartsTooltip,
} from 'recharts';
import { 
  Sparkles, 
  BrainCircuit, 
  Calendar, 
  Zap, 
  FileText,
  Share2, 
  ArrowUpRight, 
  ChevronRight,
  Layout,
  Layers,
  Activity,
  ArrowRight,
  TestTube2,
  Trash2,
  Undo2
} from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { Transaction, Budget } from '../types';
import { CATEGORIES } from '../constants';
import { getAIInsights } from '../services/geminiService';

const m = motion as any;

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  currency: string;
}

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];

const Analysis: React.FC<Props> = ({ transactions, budgets, currency }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showInfographic, setShowInfographic] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isArchitectMode, setIsArchitectMode] = useState(false);
  const [architectScenarios, setArchitectScenarios] = useState<{name: string, amt: number}[]>([]);

  const expenses = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const architectImpact = useMemo(() => {
    return architectScenarios.reduce((sum, s) => sum + s.amt, 0);
  }, [architectScenarios]);

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
      return { day: format(targetDate, 'EEE'), amount: dayTotal };
    });
  }, [expenses]);

  const fetchAI = async () => {
    if (transactions.length === 0) return;
    setLoadingAI(true);
    try {
      const data = await getAIInsights(transactions, budgets);
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 2 && !reportData) {
      fetchAI();
    }
  }, [transactions.length]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <m.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10"
        >
          <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">{payload[0].name || payload[0].payload.day}</p>
          <p className="text-xl font-black">{currency}{payload[0].value.toLocaleString()}</p>
        </m.div>
      );
    }
    return null;
  };

  const InfographicMode = () => (
    <m.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto no-scrollbar p-8 pb-32"
    >
      <div className="max-w-md mx-auto space-y-16">
        <header className="flex items-center justify-between">
          <button onClick={() => setShowInfographic(false)} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <Undo2 size={14} /> Back
          </button>
          <button className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
            <Share2 size={18} />
          </button>
        </header>

        <div className="space-y-4 text-center">
          <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">Annualized Intelligence</h2>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Wealth Digest.</h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{format(new Date(), 'MMMM yyyy')}</p>
        </div>

        <section className="bg-slate-900 text-white rounded-[3.5rem] p-12 space-y-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-[100px] opacity-20 -translate-y-10 translate-x-10" />
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Executive Score</h3>
            <h2 className="text-8xl font-black tracking-tighter leading-none">{reportData?.score || 82}</h2>
          </div>
          <p className="text-sm font-bold text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-6">
            "{reportData?.prediction || "Maintaining current velocity will ensure target savings are reached by month-end with minimal adjustments."}"
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight px-2">High-Impact Facts</h3>
          <div className="grid grid-cols-1 gap-4">
            {reportData?.stats?.map((stat: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                <span className="text-xl font-black text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 bg-indigo-50 rounded-[3.5rem] p-10 border border-indigo-100">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-indigo-600" />
            <h3 className="text-xl font-black text-indigo-900 tracking-tight">Strategic Steps</h3>
          </div>
          <div className="space-y-6">
            {reportData?.insights?.map((insight: any, i: number) => (
              <div key={i} className="flex gap-6">
                <span className="text-3xl font-black text-indigo-200">{i + 1}</span>
                <p className="text-sm font-bold text-indigo-900/70 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-20 border-t border-slate-100">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">The Spent Intelligence Core v4.0</p>
        </div>
      </div>
    </m.div>
  );

  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-4 space-y-10"
    >
      <AnimatePresence>
        {showInfographic && <InfographicMode key="infographic" />}
      </AnimatePresence>

      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence</h2>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Data-Driven Future</p>
        </div>
        <div className="flex gap-2">
          <m.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsArchitectMode(!isArchitectMode)}
            className={`p-3.5 rounded-[1.25rem] shadow-xl flex items-center gap-2 transition-colors ${isArchitectMode ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'}`}
          >
            <TestTube2 size={20} />
          </m.button>
          <m.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfographic(true)}
            className="p-3.5 bg-slate-900 text-white rounded-[1.25rem] shadow-xl flex items-center gap-2"
          >
            <FileText size={20} />
          </m.button>
        </div>
      </header>

      <AnimatePresence>
        {isArchitectMode && (
          <m.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900 rounded-[3rem] p-8 space-y-8 overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 p-4 opacity-20"><BrainCircuit size={48} className="text-amber-500" /></div>
             <div className="space-y-1 relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Scenario Architect</h4>
               <p className="text-sm font-bold text-slate-100">Simulate potential future expenses to see impact.</p>
             </div>

             <div className="space-y-4">
               {architectScenarios.map((s, i) => (
                 <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className="flex flex-col">
                     <span className="text-[11px] font-black text-white">{s.name}</span>
                     <span className="text-[9px] font-black text-slate-500 uppercase">Impact: High</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="text-sm font-black text-amber-500">-{currency}{s.amt.toLocaleString()}</span>
                     <button onClick={() => setArchitectScenarios(prev => prev.filter((_, idx) => idx !== i))}>
                        <Trash2 size={16} className="text-red-400" />
                     </button>
                   </div>
                 </div>
               ))}
               <button 
                onClick={() => setArchitectScenarios(prev => [...prev, {name: 'Simulation Asset', amt: 500}])}
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-500 transition-colors"
               >
                 + Draft Potential Expense
               </button>
             </div>

             {architectImpact > 0 && (
               <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-slate-400">Projected Health Score Shift</span>
                 <span className="text-2xl font-black text-red-500">-{Math.round(architectImpact / 100)} pts</span>
               </div>
             )}
          </m.section>
        )}
      </AnimatePresence>

      <section className="bg-white rounded-[3.5rem] p-10 soft-shadow border border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center mb-10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Wealth Efficiency Score</h4>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter">
                {Math.max(0, (reportData?.score || 82) - Math.round(architectImpact / 100))}
              </h1>
              <div className="flex flex-col items-start">
                 <span className={`${architectImpact > 0 ? 'text-red-500' : 'text-emerald-500'} font-black text-sm flex items-center gap-0.5`}>
                   {architectImpact > 0 ? '-' : '+'}{architectImpact > 0 ? Math.round(architectImpact / 100) : '4'}%
                 </span>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Real-time</span>
              </div>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-6 border border-slate-50">
            <m.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, (reportData?.score || 82) - Math.round(architectImpact / 100))}%` }}
              className={`h-full ${architectImpact > 0 ? 'bg-amber-500' : 'bg-indigo-600'} rounded-full transition-colors`}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <Zap size={14} className="text-indigo-600 fill-current" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {architectImpact > 0 ? 'Simulation: Impact Projected' : 'Status: Optimal'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50 group">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribution</h4>
              <p className="text-lg font-black text-slate-900 tracking-tight">Category Mix</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
              <Layers size={20} />
            </div>
          </div>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    stroke="none"
                 >
                   {categoryData.map((_, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                      />
                   ))}
                 </Pie>
                 <RechartsTooltip content={<CustomTooltip />} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Diversity</span>
               <span className="text-2xl font-black text-slate-900">{categoryData.length} Cats</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 group">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</h4>
              <p className="text-lg font-black text-slate-900 tracking-tight">Last 7 Days</p>
            </div>
            <div className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm">
              <Activity size={20} />
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }} dy={10} />
                <Bar dataKey="amount" fill="#0f172a" radius={[12, 12, 12, 12]} barSize={22} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#e2e8f0', radius: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="h-20" />
    </m.div>
  );
};

export default Analysis;
