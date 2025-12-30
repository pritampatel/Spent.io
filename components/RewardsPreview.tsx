
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Sparkles, LogIn, ChevronRight, CheckCircle2, Coins, ArrowRight } from 'lucide-react';

const RewardsPreview: React.FC = () => {
  const [step, setStep] = useState<'login' | 'claiming' | 'success'>('login');

  const handleSimulateLogin = () => {
    setStep('claiming');
    setTimeout(() => setStep('success'), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Trophy className="text-amber-500" size={20} />
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Rewards Program</h4>
      </div>

      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 min-h-[320px] flex flex-col justify-center items-center text-center shadow-2xl">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/20 blur-[60px] rounded-full" />

        <AnimatePresence mode="wait">
          {step === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 space-y-6"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto mb-4">
                <LogIn size={32} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Sync & Earn</h3>
                <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto leading-relaxed">
                  Join Spent.io Rewards. Get <span className="text-amber-400 font-bold">500 XP</span> for your first transaction sync.
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSimulateLogin}
                className="group flex items-center justify-center gap-3 w-full py-4 px-8 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
              >
                Connect Account
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {step === 'claiming' && (
            <motion.div 
              key="claiming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-transparent blur-xl opacity-50"
                />
                <div className="relative w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/40">
                  <Gift size={40} className="text-white animate-bounce" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Claiming Reward...</h3>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ delay: i * 0.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 space-y-6"
            >
              <div className="relative mx-auto w-24 h-24">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500 rounded-full"
                />
                <div className="relative w-full h-full bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Reward Unlocked!</h3>
                <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full py-2 px-4 w-fit mx-auto">
                  <Coins size={14} className="text-amber-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">+500 XP Earned</span>
                </div>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('login')}
                className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
              >
                Back to Dashboard
              </motion.button>
              
              {/* Confetti-like particles simulation with motion */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 200, 
                    y: (Math.random() - 0.5) * 200,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 bg-amber-400 rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RewardsPreview;
