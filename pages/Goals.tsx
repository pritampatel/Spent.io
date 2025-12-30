
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flag, Rocket, Plus, ChevronRight, Zap } from 'lucide-react';

interface Props {
  currency: string;
}

const GoalsPage: React.FC<Props> = ({ currency }) => {
  const goals = [
    { name: 'Tesla Model Y', target: 54000, current: 12000, color: 'bg-indigo-500', icon: <Zap size={20} /> },
    { name: 'Swiss Holiday', target: 8000, current: 6500, color: 'bg-emerald-500', icon: <Rocket size={20} /> },
    { name: 'New Mac Studio', target: 4500, current: 1200, color: 'bg-orange-500', icon: <Target size={20} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="px-6 py-4 space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Savings Goals</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visualize your future</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl"
        >
          <Plus size={20} />
        </motion.button>
      </header>

      <div className="space-y-6">
        {goals.map((goal, idx) => {
          const percentage = (goal.current / goal.target) * 100;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-6 soft-shadow border border-slate-50 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${goal.color} shadow-lg shadow-indigo-100`}>
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{goal.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {currency}{goal.current.toLocaleString()} of {currency}{goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-indigo-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${goal.color} relative`}
                  >
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${goal.color} opacity-[0.03] rounded-full -translate-y-8 translate-x-8`} />
            </motion.div>
          );
        })}
      </div>

      <div className="bg-indigo-50 rounded-[2rem] p-6 flex items-start gap-4 border border-indigo-100">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
          <Flag size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-1">Financial Tip</h4>
          <p className="text-[11px] font-bold text-indigo-900/70 leading-relaxed italic">
            "Based on your current savings rate, you will reach your Swiss Holiday goal in 4 months. Keep it up!"
          </p>
        </div>
      </div>

      <div className="h-10" />
    </motion.div>
  );
};

export default GoalsPage;
