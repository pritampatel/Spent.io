
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid,
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
  Undo2,
  Download,
  Info,
  TrendingUp,
  Target,
  Flame,
  Globe,
  Award
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

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#475569'];

const Analysis: React.FC<Props> = ({ transactions, budgets, currency }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showInfographic, setShowInfographic] = useState(false);
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

  const dailyVelocityData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const targetDate = subDays(new Date(), 13 - i);
      const dayTotal = expenses
        .filter(t => isSameDay(new Date(t.date), targetDate))
        .reduce((sum, t) => sum + t.amount, 0);
      return { 
        date: format(targetDate, 'MMM dd'), 
        amount: dayTotal,
        displayDate: format(targetDate, 'EEE')
      };
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
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-slate-900/95 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10"
        >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
            {payload[0].payload.name || payload[0].payload.date}
          </p>
          <p className="text-xl font-black">{currency}{payload[0].value.toLocaleString()}</p>
        </m.div>
      );
    }
    return null;
  };

  const InfographicOverlay = () => (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto no-scrollbar"
    >
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      
      <div className="max-w-md mx-auto p-8 space-y-10 pb-32 relative">
        <header className="flex items-center justify-between sticky top-0 z-10 py-4 bg-slate-950/80 backdrop-blur-md -mx-8 px-8 border-b border-white/5">
          <m.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfographic(false)} 
            className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/60 border border-white/10"
          >
            <Undo2 size={20} />
          </m.button>
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Intelligence Briefing</h2>
          <m.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"
          >
            <Download size={18} />
          </m.button>
        </header>

        {/* Title Section */}
        <div className="space-y-4 pt-4">
          <m.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Premium Intelligence Report</span>
          </m.div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.85] uppercase">Wealth <br/><span className="text-indigo-500">Report.</span></h1>
          <div className="flex items-center gap-4 text-white/40 text-[11px] font-black uppercase tracking-[0.2em]">
            <span>{format(new Date(), 'MMMM yyyy')}</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span>ID: #S-8821</span>
          </div>
        </div>

        {/* Hero Score Card - Bento Style */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
            <div className="relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Portfolio Health</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-8xl font-black text-white tracking-tighter leading-none">{reportData?.score || 85}</span>
                <span className="text-2xl font-black text-white/40">/100</span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-4 p-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Zap size={18} className="text-amber-400 fill-amber-400" />
              </div>
              <p className="text-[11px] font-bold text-white/90 leading-tight">
                {reportData?.prediction || "Scanning your spending velocity for future projections..."}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
            <Activity size={20} className="text-indigo-400" />
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-2xl font-black text-white">94.2%</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
            <Target size={20} className="text-emerald-400" />
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Stability</p>
              <p className="text-2xl font-black text-white">Stable</p>
            </div>
          </div>
        </section>

        {/* Key Performance Indicators */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-2">Key Findings</h3>
          <div className="space-y-3">
            {reportData?.stats?.map((stat: any, i: number) => (
              <m.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-7 bg-white/5 rounded-[2rem] border border-white/5"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{stat.label}</span>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                   <ArrowUpRight size={20} className="text-indigo-400" />
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* AI Strategic Intelligence */}
        <section className="bg-white rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Strategy</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Hub</p>
            </div>
          </div>
          
          <div className="space-y-6 relative z-10">
            {reportData?.insights?.map((insight: any, i: number) => (
              <div key={i} className="flex gap-5 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                  0{i + 1}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${insight.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {insight.priority} Priority
                    </span>
                  </div>
                  <p className="text-[14px] font-bold text-slate-700 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Branding */}
        <div className="text-center pt-10 pb-10 opacity-30">
          <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Spent.io Intelligence Lab</p>
          <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-2">© 2024 Intelligent Financial Services</p>
        </div>
      </div>
    </m.div>
  );

  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-6 space-y-8 pb-32"
    >
      <AnimatePresence>
        {showInfographic && <InfographicOverlay key="infographic" />}
      </AnimatePresence>

      {/* Hero Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Portfolio<br/><span className="text-indigo-600">Insights</span></h2>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">AI Live Sync Active</p>
          </div>
        </div>
        <m.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfographic(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-[1.75rem] shadow-2xl flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <FileText size={24} className="relative z-10" />
        </m.button>
      </header>

      {/* Efficiency Score Card */}
      <section className="bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-[100px] translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Wealth Score</h4>
              <m.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-8xl font-black text-slate-900 tracking-tighter leading-none"
              >
                {reportData?.score || 85}
              </m.h1>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
               <Award size={28} />
            </div>
          </div>

          <div className="space-y-4">
             <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-50 shadow-inner">
                <m.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${reportData?.score || 85}%` }}
                  className="h-full bg-indigo-600 rounded-full relative overflow-hidden"
                >
                  <m.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </m.div>
             </div>
             <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Ranking</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Top 15%</span>
             </div>
          </div>
        </div>
      </section>

      {/* AI Intelligence Deck */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
             <Sparkles size={18} className="text-indigo-600" />
             <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Intelligence</h3>
           </div>
           <m.button 
             whileTap={{ scale: 0.9 }}
             onClick={fetchAI} 
             disabled={loadingAI} 
             className={`p-2 bg-indigo-50 text-indigo-600 rounded-xl transition-all ${loadingAI ? 'opacity-50' : ''}`}
           >
             <BrainCircuit size={18} className={loadingAI ? 'animate-spin' : ''} />
           </m.button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {reportData?.insights?.map((insight: any, i: number) => (
              <m.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.25rem] p-7 border border-slate-50 soft-shadow group hover:border-indigo-100 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    {i === 0 ? <Zap size={22} className="text-amber-400" /> : i === 1 ? <Target size={22} className="text-emerald-400" /> : <Flame size={22} className="text-orange-400" />}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${insight.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                          {insight.priority} Impact
                       </span>
                    </div>
                    <p className="text-[14px] font-bold text-slate-700 leading-tight">{insight.text}</p>
                  </div>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Visual Data Grids */}
      <section className="space-y-8">
        <div className="bg-slate-950 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Velocity</h4>
              <p className="text-xl font-black text-white tracking-tight">Daily Burn Rate</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/10">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-60 w-full relative z-10 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyVelocityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#velocityGrad)" 
                  animationDuration={1500}
                />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#475569' }} 
                  dy={15}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Composition</h4>
              <p className="text-xl font-black text-slate-900 tracking-tight">Category Mix</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-10">
             <div className="h-72 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={85}
                      outerRadius={115}
                      paddingAngle={6}
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
                          className="outline-none"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Diversity</span>
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">{categoryData.length}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full">
                {categoryData.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.75rem] border border-slate-100">
                     <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{d.name}</p>
                        <p className="text-sm font-black text-slate-800">{currency}{d.value.toLocaleString()}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </m.div>
  );
};

export default Analysis;
