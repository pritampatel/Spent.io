
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, ChevronRight, Sparkles } from 'lucide-react';

const m = motion as any;

interface Props {
  isVisible: boolean;
  onClose: () => void;
  message?: string | null;
  subtitle?: string | null;
}

const NotificationToast: React.FC<Props> = ({ isVisible, onClose, message, subtitle }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-4 right-4 z-[400] max-w-md mx-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles size={60} className="text-white" />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-xl opacity-40 animate-pulse" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Achievement Unlocked</span>
                <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-sm font-black text-white tracking-tight">{message || "Reward Secured"}</h4>
              {subtitle && (
                <p className="text-[11px] font-bold text-slate-400 leading-tight mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <ChevronRight size={16} />
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
