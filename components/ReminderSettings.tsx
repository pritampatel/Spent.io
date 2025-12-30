
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Moon, Sparkles, ChevronRight } from 'lucide-react';

const ReminderSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [time, setTime] = useState('22:00');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Bell className="text-indigo-500" size={20} />
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Smart Reminders</h4>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 soft-shadow space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors duration-500 ${isEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
              <Moon size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 tracking-tight">Nightly Review</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Add missing expenses</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <motion.div 
              animate={{ x: isEnabled ? 28 : 4 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>

        <div className={`space-y-4 transition-opacity duration-500 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled For</span>
            </div>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent border-none text-base font-black text-indigo-600 focus:ring-0 p-0 text-right cursor-pointer"
            />
          </div>

          <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 flex gap-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <p className="text-[10px] font-bold text-indigo-900/60 leading-relaxed italic">
              "We'll nudge you at <span className="text-indigo-700 font-black">{time}</span> to ensure your portfolio data is 100% accurate."
            </p>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
        >
          Save Schedule
        </motion.button>
      </div>
    </div>
  );
};

export default ReminderSettings;
