
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Moon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const m = motion as any;

const ReminderSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [time, setTime] = useState('21:00');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        setIsEnabled(true);
        new Notification("Spent.io Enabled", {
          body: "Smart reminders are now active. We'll nudge you daily!",
          icon: "https://picsum.photos/seed/spent/200"
        });
      }
    } catch (e) {
      console.error("Permission request failed", e);
    }
  };

  const handleToggle = () => {
    if (permissionStatus !== 'granted') {
      requestPermission();
    } else {
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Bell className="text-indigo-500" size={20} />
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Smart Reminders</h4>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 soft-shadow space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors duration-500 ${isEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
              <Moon size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 tracking-tight">Financial Check-in</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End of day recap</p>
            </div>
          </div>
          
          <button 
            onClick={handleToggle}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <m.div 
              animate={{ x: isEnabled ? 28 : 4 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>

        {permissionStatus === 'denied' && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100 flex gap-4">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-black text-red-900 uppercase">Permissions Blocked</p>
              <p className="text-[10px] text-red-700/70 leading-relaxed">
                Please enable notifications in your browser settings to receive daily recaps.
              </p>
            </div>
          </div>
        )}

        <div className={`space-y-4 transition-all duration-500 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trigger At</span>
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
              "We'll nudge you at <span className="text-indigo-700 font-black">{time}</span>. Accurate logs lead to accurate growth."
            </p>
          </div>
        </div>

        <m.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
          className={`w-full py-5 rounded-[1.75rem] font-black uppercase text-[10px] tracking-widest shadow-xl transition-colors ${isEnabled ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
        >
          {isEnabled ? 'Update Schedule' : 'Sync Notification Service'}
        </m.button>
      </div>
    </div>
  );
};

export default ReminderSettings;
