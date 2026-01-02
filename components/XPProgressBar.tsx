
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Star } from 'lucide-react';

const m = motion as any;

interface Props {
  xp: number;
  level: number;
}

const XPProgressBar: React.FC<Props> = ({ xp, level }) => {
  const xpForNextLevel = 1000;
  const progress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  const controls = useAnimation();
  const [prevXp, setPrevXp] = useState(xp);

  useEffect(() => {
    if (xp > prevXp) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 }
      });
      setPrevXp(xp);
    }
  }, [xp, prevXp, controls]);

  return (
    <div className="w-full px-5 py-0.5">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <m.div 
            animate={controls}
            className="w-3.5 h-3.5 bg-amber-500 rounded flex items-center justify-center"
          >
            <Star size={8} className="text-white fill-current" />
          </m.div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Level {level}</span>
        </div>
        <span className="text-[7px] font-black text-indigo-600 uppercase tracking-widest">
          {Math.floor(xp % xpForNextLevel)} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/50 relative">
        <m.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
          className="h-full bg-indigo-500 rounded-full relative overflow-hidden"
        >
          <m.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </m.div>
      </div>
    </div>
  );
};

export default XPProgressBar;
