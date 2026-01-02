
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Star, 
  Crown, 
  LayoutGrid,
  ShieldCheck,
  ArrowUpRight,
  Gem,
  CheckCircle2,
  Lock,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Profile, Transaction } from '../types';
import { isSameDay, subDays, parseISO } from 'date-fns';

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

const RewardsHub: React.FC<Props> = ({ profile, transactions, onAddXP }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentStreak, setCurrentStreak] = useState(1);

  // Define the missions list with the requested Daily Login Bonus tiers
  const missionsList: Achievement[] = [
    { 
      id: 'pulse-1', 
      title: 'Daily Login Bonus', 
      desc: 'Consecutive daily login streak.', 
      category: 'Streak', 
      icon: <Flame size={14} className="text-orange-400" />,
      tiers: [
        { target: 3, xp: 100 }, 
        { target: 10, xp: 500 }, 
        { target: 30, xp: 2500 }
      ],
      current: 1 // placeholder updated in useMemo
    },
    { 
      id: 'exp-1', 
      title: 'Data Spender', 
      desc: 'Log unique category expenses.', 
      category: 'Tracking', 
      icon: <LayoutGrid size={14} className="text-blue-400" />,
      tiers: [{ target: 5, xp: 50 }, { target: 20, xp: 200 }, { target: 100, xp: 1000 }],
      current: 12
    },
    { 
      id: 'ghost-1', 
      title: 'Shadow Ghost', 
      desc: 'Zero-spending days tracked.', 
      category: 'Budget', 
      icon: <Target size={14} className="text-purple-400" />,
      tiers: [{ target: 1, xp: 100 }, { target: 7, xp: 500 }, { target: 30, xp: 2500 }],
      current: 3
    },
    { 
      id: 'arch-1', 
      title: 'Protocol Architect', 
      desc: 'Maintain budget thresholds.', 
      category: 'Budget', 
      icon: <ShieldCheck size={14} className="text-emerald-400" />,
      tiers: [{ target: 1, xp: 300 }, { target: 5, xp: 1500 }, { target: 12, xp: 5000 }],
      current: 0
    }
  ];

  useEffect(() => {
    const lastLoginStr = localStorage.getItem('spent_last_login');
    const savedStreakStr = localStorage.getItem('spent_streak');
    const today = new Date();
    
    let streak = savedStreakStr ? parseInt(savedStreakStr, 10) : 1;

    if (lastLoginStr) {
      const lastLogin = parseISO(lastLoginStr);
      const yesterday = subDays(today, 1);
      if (isSameDay(lastLogin, yesterday)) {
        streak += 1;
        localStorage.setItem('spent_streak', streak.toString());
      } else if (!isSameDay(lastLogin, today)) {
        streak = 1;
        localStorage.setItem('spent_streak', '1');
      }
    }

    setCurrentStreak(streak);
    localStorage.setItem('spent_last_login', today.toISOString());
    if (!savedStreakStr) localStorage.setItem('spent_streak', '1');

    // Automatically award XP and notify when a streak milestone is reached
    const milestoneTargets = [3, 10, 30];
    if (milestoneTargets.includes(streak)) {
      const lastNotified = localStorage.getItem('spent_last_streak_milestone');
      if (lastNotified !== streak.toString()) {
        const pulseMission = missionsList.find(m => m.id === 'pulse-1');
        const tier = pulseMission?.tiers.find(t => t.target === streak);
        if (tier) {
          setTimeout(() => {
            onAddXP(tier.xp, "STREAK MILESTONE!", `${streak} DAY LOGIN BONUS GRANTED`);
            localStorage.setItem('spent_last_streak_milestone', streak.toString());
          }, 1500);
        }
      }
    }
  }, []);

  const categories = ['All', 'Tracking', 'Budget', 'Streak'];

  const missions: Achievement[] = useMemo(() => {
    return missionsList.map(m => m.id === 'pulse-1' ? { ...m, current: currentStreak } : m);
  }, [currentStreak]);

  const filteredMissions = useMemo(() => 
    missions.filter(m => activeCategory === 'All' || m.category === activeCategory)
  , [activeCategory, missions]);

  const handleClaim = (mission: Achievement, tierIdx: number, e: React.MouseEvent) => {
    // If it's a streak mission, we already auto-claim it in useEffect to ensure user gets it immediately.
    // For others, we allow manual claiming.
    if (mission.id === 'pulse-1') return; 

    const tier = mission.tiers[tierIdx];
    const claimKey = `claimed_${mission.id}_${tier.target}`;
    if (localStorage.getItem(claimKey)) return;

    onAddXP(tier.xp, `Tier ${tierIdx + 1} Unlocked!`, `${mission.title} reward secured`, e.clientX, e.clientY);
    localStorage.setItem(claimKey, 'true');
  };

  const isTierClaimed = (missionId: string, target: number) => {
    if (missionId === 'pulse-1') return currentStreak >= target;
    return localStorage.getItem(`claimed_${missionId}_${target}`) === 'true';
  };

  const getNextMilestone = (mission: Achievement) => {
    const next = mission.tiers.find(t => mission.current < t.target);
    return next ? next.target : mission.tiers[mission.tiers.length - 1].target;
  };

  return (
    <m.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-full bg-[#020408] text-white overflow-x-hidden selection:bg-indigo-500/30"
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      <header className="px-5 pt-10 pb-4 bg-[#020408]/80 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <h1 className="text-lg font-black tracking-tight leading-none">Prestige Vault</h1>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Operational Rewards</p>
             </div>
          </div>
          <m.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10"
          >
            <Flame size={12} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-tight">{currentStreak}D STREAK</span>
          </m.div>
        </div>
      </header>

      <div className="px-5 space-y-5 pt-6 pb-32 relative z-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-white/5 text-slate-500 border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <Sparkles size={14} className="text-indigo-400" />
             <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Season Objectives</h3>
          </div>
          
          <div className="grid gap-3">
            {filteredMissions.map((mission, idx) => {
              const nextMilestone = getNextMilestone(mission);
              const isStreakMission = mission.id === 'pulse-1';
              const progress = Math.min(100, (mission.current / nextMilestone) * 100);
              
              return (
                <m.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`relative group border border-white/5 rounded-[2rem] p-4 space-y-4 overflow-hidden ${isStreakMission ? 'bg-gradient-to-br from-[#121421] to-[#080912]' : 'bg-white/[0.03]'}`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl ${isStreakMission ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-900/50'}`}>
                          {mission.icon}
                       </div>
                       <div>
                          <h4 className="text-[14px] font-black tracking-tight">{mission.title}</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{mission.desc}</p>
                       </div>
                    </div>
                    <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                       <span className="text-[12px] font-black tracking-tighter block leading-none">
                         {mission.current} <span className="text-[8px] text-slate-600 opacity-60">/ {nextMilestone}</span>
                       </span>
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                      <m.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full rounded-full ${isStreakMission ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 relative z-10">
                    {mission.tiers.map((tier, tIdx) => {
                      const isAchieved = mission.current >= tier.target;
                      const isClaimed = isTierClaimed(mission.id, tier.target);
                      
                      return (
                        <m.button
                          key={tIdx}
                          whileTap={isAchieved && !isClaimed ? { scale: 0.95 } : {}}
                          onClick={(e) => isAchieved && handleClaim(mission, tIdx, e)}
                          className={`relative py-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${isAchieved ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)]' : 'bg-white/[0.02] border-white/5 opacity-40'}`}
                        >
                          <Star size={10} className={isAchieved ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                          <div className="text-center">
                            <span className={`text-[9px] font-black leading-none block ${isAchieved ? 'text-amber-400' : 'text-slate-500'}`}>
                              {tier.target}{isStreakMission ? 'D' : 'P'}
                            </span>
                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter mt-1 block">+{tier.xp} XP</span>
                          </div>
                          {isClaimed && (
                            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-[#020408]">
                               <CheckCircle2 size={8} className="text-white" />
                            </div>
                          )}
                          {!isAchieved && <Lock size={7} className="text-white/20 absolute top-2 right-2" />}
                        </m.button>
                      );
                    })}
                  </div>
                </m.div>
              );
            })}
          </div>
        </section>

        <section className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] p-5 flex items-center justify-between group cursor-pointer hover:bg-indigo-600/10 transition-colors">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                 <Gem size={20} />
              </div>
              <div>
                 <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-0.5">Rank: Portfolio Lead</h4>
                 <p className="text-[9px] text-indigo-400/60 font-bold uppercase tracking-widest">Efficiency Multiplier: 1.2x</p>
              </div>
           </div>
           <ChevronRight size={18} className="text-indigo-400/40 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </section>
      </div>
    </m.div>
  );
};

export default RewardsHub;
