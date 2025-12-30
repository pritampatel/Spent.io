
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, Shield, ChevronRight, Bell, Edit3, Check, Globe, CreditCard, HelpCircle, 
  FlaskConical, PlayCircle, Sparkles, Zap, TestTube2, Trophy, Flame, Leaf, Swords
} from 'lucide-react';
import { Profile } from '../types';
import RewardsPreview from '../components/RewardsPreview';
import ReminderSettings from '../components/ReminderSettings';

interface Props {
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onSimulateNotification: () => void;
  onClaimReward: () => void;
}

const ProfilePage: React.FC<Props> = ({ profiles, activeProfileId, onSwitchProfile, onSimulateNotification, onClaimReward }) => {
  const [isEditing, setIsEditing] = useState(false);
  const activeProfile = profiles.find(p => p.id === activeProfileId)!;

  const quests = [
    { title: "Daily Streak", icon: <Flame size={20} className="text-orange-500" />, progress: 80, reward: "100 XP", color: "from-orange-500/10 to-transparent" },
    { title: "Eco-Warrior", icon: <Leaf size={20} className="text-emerald-500" />, progress: 30, reward: "250 XP", color: "from-emerald-500/10 to-transparent" },
    { title: "Budget Architect", icon: <Swords size={20} className="text-indigo-500" />, progress: 10, reward: "500 XP", color: "from-indigo-500/10 to-transparent" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-2 space-y-10">
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[3.5rem] blur-xl" />
        <div className="relative bg-slate-50 border-2 border-indigo-100/50 rounded-[3rem] p-8 space-y-8 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <FlaskConical size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Quest Center</h3>
            </div>
            <Trophy size={20} className="text-amber-500" />
          </div>

          <div className="space-y-4">
            {quests.map((q, i) => (
              <motion.div 
                key={i}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-[2rem] p-5 border border-slate-100 soft-shadow flex items-center justify-between bg-gradient-to-r ${q.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    {q.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800 tracking-tight">{q.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${q.progress}%` }} />
                      </div>
                      <span className="text-[8px] font-black text-indigo-600">{q.reward}</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClaimReward} className="p-2 bg-slate-900 text-white rounded-lg">
                  <PlayCircle size={14} />
                </button>
              </motion.div>
            ))}
          </div>

          <RewardsPreview />
          <ReminderSettings />
          
          <div className="bg-white rounded-[2.5rem] p-6 soft-shadow border border-indigo-50">
            <h4 className="text-sm font-black text-slate-800 tracking-tight mb-4">Labs: Notification Test</h4>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onSimulateNotification}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"
            >
              <Bell size={18} /> Force Test Reminder
            </motion.button>
          </div>
        </div>
      </div>

      <section className="relative mt-8">
        <div className="relative bg-white rounded-[3rem] p-10 soft-shadow border border-slate-50 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img src={activeProfile.avatar} alt="" className="w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-2xl" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{activeProfile.name}</h3>
          <p className="text-[9px] font-black text-indigo-600 uppercase mt-1">Level {activeProfile.level} Legend</p>
        </div>
      </section>

      <div className="h-48" />
    </motion.div>
  );
};

export default ProfilePage;
