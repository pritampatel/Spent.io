
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Bell, X, ChevronRight } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<Props> = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-4 right-4 z-[200] max-w-md mx-auto"
        >
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse" />
              <div className="relative w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <Moon size={24} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Spent.io • Now</span>
                <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-sm font-black text-white tracking-tight">Daily Portfolio Review</h4>
              <p className="text-[11px] font-medium text-slate-400 leading-tight">It's 10:00 PM. Don't forget to sync your today's coffee and travel expenses!</p>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <ChevronRight size={16} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
