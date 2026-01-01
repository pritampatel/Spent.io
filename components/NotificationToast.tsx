
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, ChevronRight, Zap, Sparkles } from 'lucide-react';

const m = motion as any;

interface Props {
  isVisible: boolean;
  onClose: () => void;
  message?: string | null;
  subMessage?: string | null;
}

const NotificationToast: React.FC<Props> = ({ isVisible, onClose, message, subMessage }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ y: -100, opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ y: 20, opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ y: -100, opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-4 right-4 z-[500] max-w-md mx-auto pointer-events-none"
        >
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex items-center gap-5 pointer-events-auto relative overflow-hidden group">
            {/* Animated Background Polish */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
            
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-amber-500 blur-xl opacity-40 animate-pulse" />
              <m.div 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl"
              >
                <Trophy size={28} />
              </m.div>
              <div className="absolute -bottom-1 -right-1">
                <Sparkles size={16} className="text-amber-400 fill-amber-400" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Zap size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Spent.io Achievement</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }} 
                  className="p-1 text-white/20 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-[15px] font-black text-white tracking-tight leading-tight truncate">
                {message || "Milestone Reached!"}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5 opacity-80">
                {subMessage || "Your financial future is looking bright."}
              </p>
            </div>
            
            <m.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 shrink-0 border border-white/5"
            >
              <ChevronRight size={18} />
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
