
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Crown, 
  Zap,
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Map,
  ArrowUpRight,
  Gem,
  CheckCircle2,
  Lock,
  Target
} from 'lucide-react';
import { Profile, Transaction } from '../types';

const m = motion as any;

interface Props {
  profile: Profile;
  transactions: Transaction[];
  onAddXP: (amt: number, msg: string, sub?: string, sourceX?: number, sourceY?: number) => void;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: any;
  category: string;
  tiers: { target: number; xp: number }[];
  current: number;
}

const MISSIONS: Achievement[] = [
  { 
    id: 'exp-1', 
    title: 'The Spender', 
    desc: 'Log unique expenses across categories', 
    category: 'Tracking', 
    icon: <LayoutGrid size={18} className="text-blue-400" />,
    tiers: [{ target: 5, xp: 50 }, { target: 20, xp: 200 }, { target: 100, xp: 1000 }],
    current: 12
  },
  { 
    id: 'ghost-1', 
    title: 'Financial Ghost', 
    desc: 'Zero-spending days tracked', 
    category: 'Budget', 
    icon: <Target size={18} className="text-purple-400" />,
    tiers: [{ target: 1, xp: 100 }, { target: 7, xp: 500 }, { target: 30, xp: 2500 }],
    current: 3
  },
  { 
    id: 'pulse-1', 
    title: 'The Pulse', 
    desc: 'Consecutive days logging in', 
    category: 'Streak', 
    icon: <Flame size={18} className="text-orange-400" />,
    tiers: [{ target: 3, xp: 150 }, { target: 10, xp: 800 }, { target: 365, xp: 10000 }],
    current: 1
  },
  { 
    id: 'arch-1', 
    title: 'The Architect', 
    desc: 'Budgets maintained for full periods', 
    category: 'Budget', 
    icon: <ShieldCheck size={18} className="text-emerald-400" />,
    tiers: [{ target: 1, xp: 300 }, { target: 5, xp: 1500 }, { target: 12, xp: 5000 }],
    current: 0
  }
];

const RewardsHub: React.FC<Props> = ({ profile, transactions, onAddXP }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Tracking', 'Budget', 'Streak'];
  const filteredMissions = useMemo(() => 
    MISSIONS.filter(m => activeCategory === 'All' || m.category === activeCategory)
  , [activeCategory]);

  const handleClaim = (mission: Achievement, tierIdx: number, e: React.MouseEvent) => {
    const tier = mission.tiers[tierIdx];
    onAddXP(tier.xp, `Star Unlocked: ${mission.title}`, `You've earned ${tier.xp} XP for reaching tier ${tierIdx + 1}!`, e.clientX, e.clientY);
  };

  return (
    <m.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-full bg-[#05070a] text-white selection:bg-indigo-500/30 overflow-x-hidden"
    >
      <header className="px-5 pt-10 pb-4 sticky top-0 z-50 bg-[#05070a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20" />
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                  <Crown size={18} className="text-white fill-white/20" />
                </div>
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tight leading-none mb-1">Prestige Vault</h1>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500/90">Tier: Bronze</span>
                   <div className="w-1 h-1 bg-white/10 rounded-full" />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Lv.{profile.level}</span>
                </div>
             </div>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">Rank Up</span>
          </div>
        </div>
      </header>

      <div className="px-5 space-y-6 pt-6 pb-32">
        <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative shrink-0">
               <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                  <span className="text-2xl font-black text-white">{profile.level}</span>
               </div>
               <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#05070a] shadow-xl">
                  <Zap size={12} fill="currentColor" />
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black tracking-tighter truncate mb-1">{profile.name}</h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">{profile.xp} XP Progress</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
              <m.div 
                initial={{ width: 0 }}
                animate={{ width: `${(profile.xp % 1000) / 10}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full"
              />
            </div>
            <p className="text-[8px] font-black text-center text-slate-500 uppercase tracking-[0.2em]">{1000 - (profile.xp % 1000)} XP to Next Prestige</p>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat ? 'bg-white text-black border-white shadow-lg' : 'bg-[#111624] text-slate-500 border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="space-y-4">
          {filteredMissions.map((mission, idx) => (
            <m.div
              key={mission.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#111624]/60 border border-white/5 rounded-[1.75rem] p-5 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 rounded-[1rem] flex items-center justify-center border border-white/5 shadow-inner">
                      {mission.icon}
                   </div>
                   <div>
                      <h4 className="text-[14px] font-black tracking-tight text-white leading-none mb-1">{mission.title}</h4>
                      <p className="text-[9px] font-medium text-slate-500 max-w-[160px] leading-tight">{mission.desc}</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{mission.current} Progress</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {mission.tiers.map((tier, tIdx) => {
                  const isCompleted = mission.current >= tier.target;
                  const isClaimable = isCompleted;
                  
                  return (
                    <m.button
                      key={tIdx}
                      whileTap={isClaimable ? { scale: 0.95 } : {}}
                      onClick={(e) => isClaimable && handleClaim(mission, tIdx, e)}
                      className={`relative py-3 px-2 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${isCompleted ? 'bg-amber-500/5 border-amber-500/50 shadow-lg' : 'bg-white/[0.02] border-white/5'}`}
                    >
                      <Star 
                        size={14} 
                        className={isCompleted ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} 
                      />
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${isCompleted ? 'text-amber-400' : 'text-slate-600'}`}>
                        {tier.target} pts
                      </span>
                      {!isCompleted && <Lock size={8} className="text-slate-800" />}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 bg-[#05070a] rounded-full p-0.5">
                           <CheckCircle2 size={10} className="text-amber-500" />
                        </div>
                      )}
                    </m.button>
                  );
                })}
              </div>

              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <m.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (mission.current / mission.tiers[mission.tiers.length-1].target) * 100)}%` }}
                    className="h-full bg-indigo-500 rounded-full" 
                 />
              </div>
            </m.div>
          ))}
        </section>

        <section className="bg-gradient-to-br from-[#1a1c2e] to-[#0d0e17] border border-white/5 rounded-[1.75rem] p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                 <Gem size={20} className="text-amber-500" />
              </div>
              <div>
                 <h4 className="text-sm font-black tracking-tight leading-none mb-1">Prestige Unlock</h4>
                 <p className="text-[9px] font-medium text-amber-500/60 uppercase tracking-widest">Title: Penny Pincher</p>
              </div>
           </div>
           <ArrowUpRight size={16} className="text-amber-500/50" />
        </section>

      </div>
    </m.div>
  );
};

export default RewardsHub;
