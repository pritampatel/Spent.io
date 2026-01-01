
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, Shield, ChevronRight, Bell, Edit3, Check, Globe, CreditCard, HelpCircle, 
  FlaskConical, PlayCircle, Sparkles, Zap, TestTube2, Trophy, Flame, Leaf, Swords, Heart, 
  Target as TargetIcon
} from 'lucide-react';
import { Profile } from '../types';
import RewardsPreview from '../components/RewardsPreview';
import ReminderSettings from '../components/ReminderSettings';

const m = motion as any;

interface Props {
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onSimulateNotification: () => void;
  // Fixed: Added optional x and y parameters to support XP animation from interaction source
  onClaimReward: (amount: number, message: string, x?: number, y?: number) => void;
}

const ProfilePage: React.FC<Props> = ({ profiles, activeProfileId, onSwitchProfile, onSimulateNotification, onClaimReward }) => {
  const [isEditing, setIsEditing] = useState(false);
  const activeProfile = profiles.find(p => p.id === activeProfileId)!;

  const questList = [
    { id: 'q1', title: "7-Day Streak", icon: <Flame size={20} className="text-orange-500" />, progress: 85, reward: 250, msg: "7-Day Streak Maintained! +250 XP", color: "from-orange-500/10 to-transparent" },
    { id: 'q2', title: "Eco-Warrior", icon: <Leaf size={20} className="text-emerald-500" />, progress: 45, reward: 500, msg: "Eco-Warrior Achievement! +500 XP", color: "from-emerald-500/10 to-transparent" },
    { id: 'q3', title: "Budget King", icon: <Swords size={20} className="text-indigo-500" />, progress: 15, reward: 750, msg: "Budget King Unlocked! +750 XP", color: "from-indigo-500/10 to-transparent" },
    { id: 'q4', title: "Savings Guru", icon: <TargetIcon size={20} className="text-purple-500" />, progress: 60, reward: 300, msg: "Savings Guru Progress! +300 XP", color: "from-purple-500/10 to-transparent" },
  ];

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-2 space-y-10">
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[3.5rem] blur-xl" />
        <div className="relative bg-slate-50 border-2 border-indigo-100/50 rounded-[3rem] p-8 space-y-8 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <FlaskConical size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Spent Quests</h3>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Progression</p>
              </div>
            </div>
            <Trophy size={20} className="text-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {questList.map((q) => (
              <m.div 
                key={q.id}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-[2rem] p-5 border border-slate-100 soft-shadow flex items-center justify-between bg-gradient-to-r ${q.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50">
                    {q.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-slate-800 tracking-tight mb-1">{q.title}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <m.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${q.progress}%` }}
                          className="h-full bg-indigo-600 rounded-full" 
                        />
                      </div>
                      <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{q.reward} XP</span>
                    </div>
                  </div>
                </div>
                <m.button 
                  whileTap={{ scale: 0.9, rotate: 15 }}
                  // Fixed: Passed click coordinates to onClaimReward for better XP animation feedback
                  onClick={(e: React.MouseEvent) => onClaimReward(q.reward, q.msg, e.clientX, e.clientY)} 
                  className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"
                >
                  <PlayCircle size={18} />
                </m.button>
              </m.div>
            ))}
          </div>

          <RewardsPreview />
          <ReminderSettings />
          
          <div className="bg-white rounded-[2.5rem] p-6 soft-shadow border border-indigo-50">
            <h4 className="text-sm font-black text-slate-800 tracking-tight mb-2">Security: Mobile Alerts</h4>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-6">
              Test your device's native notification sync. Ensures you never miss a budget leak.
            </p>
            <m.button 
              whileTap={{ scale: 0.95 }}
              onClick={onSimulateNotification}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"
            >
              <Bell size={18} /> Sync Device Permissions
            </m.button>
          </div>
        </div>
      </div>

      <section className="relative mt-8">
        <div className="relative bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img src={activeProfile.avatar} alt="" className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white shadow-2xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
              <Zap size={14} className="fill-current" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{activeProfile.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Lvl {activeProfile.level} Legend
            </span>
            <span className="text-[9px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest">
              {activeProfile.xp} Total XP
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Account Entities</h4>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {profiles.map((p) => (
            <m.button
              key={p.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSwitchProfile(p.id)}
              className={`flex-shrink-0 flex items-center gap-4 pl-4 pr-6 py-4 rounded-[2rem] border-2 transition-all ${activeProfileId === p.id ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'}`}
            >
              <img src={p.avatar} alt="" className="w-10 h-10 rounded-2xl shadow-sm border border-white" />
              <div className="text-left">
                <span className={`block text-[11px] font-black uppercase tracking-tighter ${activeProfileId === p.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {p.name}
                </span>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Active Entity</span>
              </div>
            </m.button>
          ))}
        </div>
      </section>

      <div className="h-48" />
    </m.div>
  );
};

export default ProfilePage;
