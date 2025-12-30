
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';

interface Props {
  xp: number;
  level: number;
}

const XPProgressBar: React.FC<Props> = ({ xp, level }) => {
  const xpForNextLevel = 1000;
  const progress = (xp % xpForNextLevel) / xpForNextLevel * 100;

  return (
    <div className="w-full px-6 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Star size={14} className="text-white fill-current" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level {level}</span>
        </div>
        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
          {Math.floor(xp % xpForNextLevel)} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] rounded-full relative overflow-hidden"
        >
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default XPProgressBar;
