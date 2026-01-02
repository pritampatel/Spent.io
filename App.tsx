
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  PieChart as PieChartIcon, 
  Plus, 
  History as HistoryIcon,
  Settings2,
  CloudLightning,
  Trophy,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import ProfilePage from './pages/Profile';
import HistoryPage from './pages/History';
import BudgetsPage from './pages/Budgets';
import RewardsHub from './pages/RewardsHub';
import AddTransactionModal from './components/AddTransactionModal';
import SplashScreen from './components/SplashScreen';
import SkeletonLoader from './components/SkeletonLoader';
import NotificationToast from './components/NotificationToast';
import XPProgressBar from './components/XPProgressBar';
import FlyingXP from './components/FlyingXP';
import { sounds } from './services/SoundManager';

import { AppState, Transaction, Profile, CategoryType } from './types';
import { INITIAL_PROFILES, MOCK_TRANSACTIONS } from './constants';

const m = motion as any;

const NavItem: React.FC<{ item: any }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  
  return (
    <NavLink 
      to={item.to} 
      className="flex-1 relative flex flex-col items-center justify-center py-2"
    >
      <m.div
        initial={false}
        animate={{
          scale: isActive ? 1.15 : 1,
          y: isActive ? -2 : 0,
        }}
        className={`flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
      >
        <div className={`p-2.5 rounded-xl transition-all duration-300 relative ${isActive ? 'bg-indigo-50 shadow-inner' : 'bg-transparent'}`}>
          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
      </m.div>
    </NavLink>
  );
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [triggerFlyingXP, setTriggerFlyingXP] = useState(false);
  const [flyingXPSource, setFlyingXPSource] = useState<{x: number, y: number} | undefined>(undefined);
  const [notifContent, setNotifContent] = useState<{title: string, sub: string} | null>(null);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('spent_io_state_v7');
    if (saved) return JSON.parse(saved);
    return {
      transactions: MOCK_TRANSACTIONS('1'),
      budgets: [
        { id: 'b1', category: 'Food', limit: 500, profileId: '1' },
      ],
      profiles: INITIAL_PROFILES,
      activeProfileId: '1',
    };
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('spent_io_state_v7', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const activeProfile = useMemo(() => 
    state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0], 
  [state]);

  const addXP = (amount: number, message?: string, sub?: string, sourceX?: number, sourceY?: number) => {
    if (sourceX && sourceY) {
      setFlyingXPSource({ x: sourceX, y: sourceY });
    } else {
      setFlyingXPSource(undefined);
    }
    
    setTriggerFlyingXP(true);
    if (message) {
      setNotifContent({ title: message, sub: sub || `+${amount} XP Gained` });
      setShowNotification(true);
    }
    
    setState(prev => {
      const newProfiles = prev.profiles.map(p => {
        if (p.id === prev.activeProfileId) {
          const newXP = p.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          if (newLevel > p.level) {
            sounds.playLevelUp();
            setNotifContent({ title: `RANK ASCENDED!`, sub: `Reached Level ${newLevel}` });
            setShowNotification(true);
          } else {
            sounds.playReward();
          }
          return { ...p, xp: newXP, level: newLevel };
        }
        return p;
      });
      return { ...prev, profiles: newProfiles };
    });
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'profileId'>) => {
    setIsSyncing(true);
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
      profileId: state.activeProfileId,
    };
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        transactions: [transaction, ...prev.transactions]
      }));
      addXP(50, "Data Point Encrypted", "+50 XP added to vault");
      setIsSyncing(false);
      setIsAddModalOpen(false);
    }, 1500);
  };

  const handleUpdateBudget = (cat: CategoryType, limit: number) => {
    setState(prev => {
      const existingIdx = prev.budgets.findIndex(b => b.category === cat && b.profileId === prev.activeProfileId);
      const newBudgets = [...prev.budgets];
      if (existingIdx > -1) {
        newBudgets[existingIdx] = { ...newBudgets[existingIdx], limit };
      } else {
        newBudgets.push({ id: Math.random().toString(), category: cat, limit, profileId: prev.activeProfileId });
      }
      return { ...prev, budgets: newBudgets };
    });
    addXP(100, "Strategy Updated", "Budget parameters locked +100 XP");
  };

  const handleSwitchProfile = (id: string) => {
    setIsSyncing(true);
    setState(prev => ({ ...prev, activeProfileId: id }));
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const handleDeleteTransaction = (id: string) => {
    setState(p => ({...p, transactions: p.transactions.filter(t => t.id !== id)}));
  };

  return (
    <HashRouter>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.1)] mesh-gradient">
        <AnimatePresence>
          {isInitializing && <SplashScreen key="splash" />}
        </AnimatePresence>

        <NotificationToast 
          isVisible={showNotification} 
          onClose={() => setShowNotification(false)} 
          message={notifContent?.title}
          subtitle={notifContent?.sub}
        />
        
        <FlyingXP 
          trigger={triggerFlyingXP} 
          sourceX={flyingXPSource?.x}
          sourceY={flyingXPSource?.y}
          onComplete={() => setTriggerFlyingXP(false)} 
        />

        {!isInitializing && (
          <div className="pt-6 pb-2 space-y-1 z-10 shrink-0">
            <header className="px-5 flex items-center justify-between">
              <m.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
                <img src={activeProfile.avatar} alt="Profile" className="w-9 h-9 rounded-lg object-cover border-2 border-white shadow-md" />
                <div>
                  <h2 className="text-[11px] font-black text-slate-900 tracking-tight leading-none mb-0.5">{activeProfile.name}</h2>
                  <div className="flex items-center gap-1 opacity-60">
                    <CloudLightning size={8} className={isSyncing ? "text-indigo-600 animate-pulse" : "text-emerald-500"} />
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">
                      {isSyncing ? "Syncing" : "Active"}
                    </span>
                  </div>
                </div>
              </m.div>
              <div className="flex items-center gap-1.5">
                <NavLink to="/rewards" className="px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center gap-1.5 border border-indigo-100/50">
                  <Trophy size={12} />
                  <span className="text-[9px] font-black">{activeProfile.level}</span>
                </NavLink>
                <NavLink to="/profile" className="p-2 bg-slate-900 text-white rounded-lg">
                  <Settings2 size={14} />
                </NavLink>
              </div>
            </header>
            <XPProgressBar xp={activeProfile.xp} level={activeProfile.level} />
          </div>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar">
          {!isInitializing ? (
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)} 
                  activeProfile={activeProfile}
                  budgets={state.budgets.filter(b => b.profileId === state.activeProfileId)}
                  onDeleteTransaction={handleDeleteTransaction}
                />} />
                <Route path="/rewards" element={<RewardsHub 
                  profile={activeProfile} 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  onAddXP={addXP}
                />} />
                <Route path="/analysis" element={<Analysis 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  budgets={state.budgets.filter(b => b.profileId === state.activeProfileId)}
                  currency={activeProfile.settings.currency}
                />} />
                <Route path="/budgets" element={<BudgetsPage 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  budgets={state.budgets.filter(b => b.profileId === state.activeProfileId)}
                  currency={activeProfile.settings.currency}
                  onUpdateBudget={handleUpdateBudget}
                />} />
                <Route path="/history" element={<HistoryPage 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  currency={activeProfile.settings.currency}
                  onDeleteTransaction={handleDeleteTransaction}
                />} />
                <Route path="/profile" element={<ProfilePage 
                  profiles={state.profiles}
                  activeProfileId={state.activeProfileId}
                  onSwitchProfile={handleSwitchProfile}
                  onSimulateNotification={() => {}}
                  onClaimReward={(amt: number, msg: string, x?: number, y?: number) => addXP(amt, msg, "", x, y)}
                />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          ) : <SkeletonLoader />}
          <div className="h-32" />
        </main>

        {!isInitializing && (
          <>
            <div className="fixed bottom-28 right-6 z-30">
              <m.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAddModalOpen(true)}
                className="w-13 h-13 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
              >
                <Plus size={24} strokeWidth={3} />
              </m.button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-5 z-40 pointer-events-none">
              <nav className="glass-card rounded-3xl p-2.5 flex items-center justify-between shadow-2xl max-w-sm mx-auto pointer-events-auto border border-white/40">
                {[
                  { to: '/', icon: LayoutGrid, label: 'Vault' },
                  { to: '/history', icon: HistoryIcon, label: 'Ledger' },
                  { to: '/rewards', icon: Trophy, label: 'Elite' },
                  { to: '/analysis', icon: PieChartIcon, label: 'Intel' },
                  { to: '/profile', icon: Settings2, label: 'Control' },
                ].map((item, idx) => (
                  <NavItem key={idx} item={item} />
                ))}
              </nav>
            </div>
          </>
        )}

        <AddTransactionModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddTransaction}
        />
      </div>
    </HashRouter>
  );
};

export default App;
