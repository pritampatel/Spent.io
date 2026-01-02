
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Bell, 
  Zap, 
  LogOut,
  Globe,
  Fingerprint,
  Settings as SettingsIcon,
  Crown,
  ShieldAlert,
  Wallet,
  Smartphone,
  Cpu,
  Mail
} from 'lucide-react';
import { Profile } from '../types';

const m = motion as any;

interface Props {
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onSimulateNotification: () => void;
  onClaimReward: (amount: number, message: string, x?: number, y?: number) => void;
}

const ProfilePage: React.FC<Props> = ({ profiles, activeProfileId, onSwitchProfile }) => {
  const activeProfile = profiles.find(p => p.id === activeProfileId)!;

  const SettingRow = ({ icon: Icon, label, value, color = "indigo", onClick }: any) => (
    <m.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between p-6 bg-white rounded-[2.25rem] border border-slate-50 shadow-sm group cursor-pointer hover:border-indigo-100 transition-colors"
    >
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={18} />
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="text-[15px] font-black text-slate-800 tracking-tight">{value}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
    </m.div>
  );

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-6 space-y-10 pb-32">
      <header className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Settings</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Configuration</p>
        </div>
      </header>

      {/* Identity Card */}
      <section className="bg-slate-950 rounded-[3.25rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
            <img src={activeProfile.avatar} alt="" className="relative w-32 h-32 rounded-[3rem] object-cover border-4 border-white/10 shadow-2xl" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-slate-950 shadow-xl">
              <Crown size={18} className="text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tighter">{activeProfile.name}</h3>
            <div className="flex items-center justify-center gap-3">
               <span className="text-[9px] font-black bg-white/5 text-indigo-400 px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/5">
                 Rank: Elite Architect
               </span>
               <span className="text-[9px] font-black bg-white/5 text-amber-400 px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/5">
                 LV.{activeProfile.level}
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Core */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Security Core</h4>
        <div className="space-y-3">
          <SettingRow icon={Fingerprint} label="Authentication" value="Biometric Vault Lock" />
          <SettingRow icon={ShieldAlert} label="Encryption" value="AES-256 Multi-Layer" />
          <SettingRow icon={Smartphone} label="Device" value="Haptic Pulse Engine" />
        </div>
      </section>

      {/* Local Logic */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Application Logic</h4>
        <div className="space-y-3">
          <SettingRow icon={Bell} label="Push Notifications" value="High Priority Alerts" />
          <SettingRow icon={Globe} label="Localization" value={`Primary: ${activeProfile.settings.currency} Currency`} />
          <SettingRow icon={Cpu} label="AI Processing" value="Real-time Alpha Insights" />
          <SettingRow icon={Mail} label="Reports" value="Monthly Intelligence Digest" />
        </div>
      </section>

      {/* Final Actions */}
      <section className="pt-10 space-y-4 text-center">
        <m.button 
          whileTap={{ scale: 0.98 }}
          className="w-full py-6 bg-red-50 text-red-500 rounded-[2.25rem] font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 border border-red-100"
        >
          <LogOut size={18} /> Terminal Logout
        </m.button>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mt-8">Spent.io Wealth OS • v4.2.0 Platinum</p>
      </section>

      <div className="h-20" />
    </m.div>
  );
};

export default ProfilePage;
