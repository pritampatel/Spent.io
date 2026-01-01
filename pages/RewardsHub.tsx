
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  Crown, 
  Medal, 
  CheckCircle2, 
  ChevronRight, 
  Zap,
  LayoutGrid,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Map,
  ArrowUpRight,
  CircleSlash,
  Gem
} from 'lucide-react';
import { Profile, Transaction } from '../types';

const m = motion as any;

interface Props {
  profile: Profile;
  transactions: Transaction[];
  onAddXP: (amt: number, msg: string, sourceX?: number, sourceY?: number) => void;
}

const ACHIEVEMENTS = [
  { 
    id: 'exp-1', 
    title: 'Wealth Logger', 
    desc: 'Record 10 unique expenses', 
    pts: 25, 
    target: 10, 
    current: 4, 
    category: 'Tracking', 
    icon: <LayoutGrid size={18} className="text-blue-400" /> 
  },
  { 
    id: 'cat-1', 
    title: 'Diversifier', 
    desc: 'Use 3 distinct categories', 
    pts: 15, 
    target: 3, 
    current: 1, 
    category: 'Tracking', 
    icon: <Map size={18} className="text-emerald-400" /> 
  },
  { 
    id: 'bud-1', 
    title: 'Discipline', 
    desc: '7 days under budget', 
    pts: 100, 
    target: 7, 
    current: 2, 
    category: 'Budget', 
    icon: <ShieldCheck size={18} className="text-purple-400" /> 
  },
  { 
    id: 'str-1', 
    title: 'Momentum', 
    desc: '3 day streak hit', 
    pts: 50, 
    target: 3, 
    current: 1, 
    category: 'Streak', 
    icon: <Flame size={18} className="text-orange-400" /> 
  }
];

const RewardsHub: React.FC<Props> = ({ profile, transactions, onAddXP }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [streakClaimed, setStreakClaimed] = useState(false);

  const categories = ['All', 'Tracking', 'Budget', 'Streak'];
  const filteredAchievements = ACHIEVEMENTS.filter(a => 
    activeCategory === 'All' || a.category === activeCategory
  );

  const handleClaimStreak = (e: React.MouseEvent) => {
    if (!streakClaimed) {
      setStreakClaimed(true);
      onAddXP(100, "Daily Momentum Claimed! +100 XP", e.clientX, e.clientY);
    }
  };

  return (
    <m.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-full bg-[#05070a] text-white selection:bg-indigo-500/30 overflow-x-hidden"
    >
      {/* 1. COMPACT PRESTIGE HEADER */}
      <header className="px-6 pt-10 pb-4 sticky top-0 z-50 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-md opacity-20" />
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                  <Crown size={20} className="text-white fill-white/20" />
                </div>
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tight leading-none mb-1">Prestige Hub</h1>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">Tier: Bronze</span>
                   <div className="w-1 h-1 bg-white/10 rounded-full" />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Global #4,201</span>
                </div>
             </div>
          </div>
          <m.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleClaimStreak}
            disabled={streakClaimed}
            className={`px-4 py-2 rounded-full flex items-center gap-2 border transition-all ${streakClaimed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-white shadow-lg shadow-indigo-500/5'}`}
          >
            <Flame size={14} className={streakClaimed ? '' : 'text-orange-500'} fill={streakClaimed ? 'currentColor' : 'none'} />
            <span className="text-[9px] font-black uppercase tracking-widest">{streakClaimed ? 'Claimed' : 'Daily Spin'}</span>
          </m.button>
        </div>
      </header>

      <div className="px-6 space-y-6 pt-6 pb-32">
        
        {/* 2. DENSE IDENTITY WIDGET */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative shrink-0">
               <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                  <span className="text-2xl font-black">{profile.level}</span>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#05070a] shadow-lg">
                  <Zap size={12} fill="currentColor" />
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black tracking-tight truncate mb-1">{profile.name}</h2>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                   {[0,1,2].map(i => <div key={i} className={`w-3 h-3 rounded-full border border-[#05070a] ${i === 0 ? 'bg-amber-500' : 'bg-white/10'}`} />)}
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rank: Elite Architect</span>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{profile.xp % 1000} XP</p>
               <p className="text-[8px] font-bold text-slate-600 uppercase">of 1,000</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <m.div 
                initial={{ width: 0 }}
                animate={{ width: `${(profile.xp % 1000) / 10}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full"
              />
            </div>
            <p className="text-[8px] font-black text-center text-slate-500 uppercase tracking-[0.2em]">Next Evolution: Silver Tier (820 XP Left)</p>
          </div>
        </section>

        {/* 3. STATUS PILLS ROW */}
        <section className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
          <div className="bg-[#111624] border border-white/5 px-5 py-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
             <div className="p-2 bg-orange-500/10 rounded-lg"><Flame size={16} className="text-orange-500" /></div>
             <div>
               <p className="text-[14px] font-black leading-none">{profile.streak} Days</p>
               <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Current Streak</p>
             </div>
          </div>
          <div className="bg-[#111624] border border-white/5 px-5 py-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
             <div className="p-2 bg-indigo-500/10 rounded-lg"><Star size={16} className="text-indigo-400" /></div>
             <div>
               <p className="text-[14px] font-black leading-none">12/51</p>
               <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Stars Earned</p>
             </div>
          </div>
          <div className="bg-[#111624] border border-white/5 px-5 py-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
             <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp size={16} className="text-emerald-400" /></div>
             <div>
               <p className="text-[14px] font-black leading-none">+12.4%</p>
               <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Growth Velocity</p>
             </div>
          </div>
        </section>

        {/* 4. ACTIVE MISSIONS (REDESIGNED LIST) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-2 mb-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Available Missions</h3>
             <div className="flex gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-3">
            {filteredAchievements.map((achievement, idx) => (
              <m.div 
                layout
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner border border-white/5 group-hover:scale-105 transition-transform">
                      {achievement.icon}
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-black tracking-tight">{achievement.title}</h4>
                        <span className="text-[7px] font-black bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase">+{achievement.pts} XP</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                         {[0,1,2].map(i => (
                           <Star key={i} size={8} className={i < 1 ? 'text-amber-500 fill-current' : 'text-white/10'} />
                         ))}
                      </div>
                      <p className="text-[9px] font-medium text-slate-500 leading-tight">{achievement.desc}</p>
                   </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                   <div className="relative w-12 h-12">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-white/5 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <m.path 
                          initial={{ strokeDasharray: "0, 100" }}
                          animate={{ strokeDasharray: `${(achievement.current / achievement.target) * 100}, 100` }}
                          className="text-indigo-500 stroke-current" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-[8px] font-black text-slate-400">{Math.round((achievement.current / achievement.target) * 100)}%</span>
                      </div>
                   </div>
                   <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{achievement.current}/{achievement.target} Units</span>
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* 5. PRESTIGE UNLOCKS (COMPACT STRIP) */}
        <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/10 rounded-[2rem] p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                 <Gem size={20} className="text-amber-500" />
              </div>
              <div>
                 <h4 className="text-sm font-black tracking-tight">Prestige Title</h4>
                 <p className="text-[9px] font-medium text-amber-500/60 uppercase tracking-widest">Penny Pincher • Active</p>
              </div>
           </div>
           <ArrowUpRight size={16} className="text-amber-500/50" />
        </section>

      </div>

      {/* BACKGROUND ACCENTS */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
    </m.div>
  );
};

export default RewardsHub;
