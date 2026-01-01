
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  PieChart as PieChartIcon, 
  Plus, 
  Target, 
  History as HistoryIcon,
  Settings2,
  FlaskConical,
  CloudLightning,
  Trophy,
  Sparkles,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import ProfilePage from './pages/Profile';
import HistoryPage from './pages/History';
import GoalsPage from './pages/Goals';
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
          y: isActive ? -4 : 0,
        }}
        className={`flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
      >
        <div className={`p-2.5 rounded-2xl transition-all duration-300 relative ${isActive ? 'bg-indigo-50 shadow-inner' : 'bg-transparent'}`}>
          <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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
  const [achievementMessage, setAchievementMessage] = useState<string | null>(null);
  const [achievementSub, setAchievementSub] = useState<string | null>(null);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('spent_io_state_v6');
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
    localStorage.setItem('spent_io_state_v6', JSON.stringify(state));
  }, [state]);

  // Handle Login Sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      
      // Perform an Initial Sync after splash
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        // Daily login reward sequence
        addXP(150, "Daily Reward Unlocked!", "You've earned +150 XP for starting your day with Spent.io.");
      }, 1500);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const activeProfile = useMemo(() => 
    state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0], 
  [state]);

  const addXP = (amount: number, message?: string, subMessage?: string, sourceX?: number, sourceY?: number) => {
    if (sourceX && sourceY) {
      setFlyingXPSource({ x: sourceX, y: sourceY });
    } else {
      setFlyingXPSource(undefined);
    }
    
    setTriggerFlyingXP(true);
    if (message) {
      setAchievementMessage(message);
      setAchievementSub(subMessage || null);
      setShowNotification(true);
    }
    
    setState(prev => {
      const newProfiles = prev.profiles.map(p => {
        if (p.id === prev.activeProfileId) {
          const newXP = p.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          if (newLevel > p.level) {
            sounds.playLevelUp();
            setAchievementMessage(`LEVEL UP! REACHED LEVEL ${newLevel}`);
            setAchievementSub("You're a financial legend now!");
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
      addXP(50, "Transaction Logged!", "Maintaining discipline yields +50 XP");
      setIsSyncing(false);
      setIsAddModalOpen(false);
    }, 1200);
  };

  const handleDeleteTransaction = (id: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setState(p => ({...p, transactions: p.transactions.filter(t => t.id !== id)}));
      setIsSyncing(false);
    }, 800);
  };

  const handleUpdateBudget = (cat: CategoryType, limit: number) => {
    setIsSyncing(true);
    setTimeout(() => {
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
      addXP(100, "Strategy Updated!", "New financial boundaries set. +100 XP");
      setIsSyncing(false);
    }, 1000);
  };

  const handleSwitchProfile = (id: string) => {
    setIsSyncing(true);
    setState(prev => ({ ...prev, activeProfileId: id }));
    setTimeout(() => setIsSyncing(false), 1200);
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
          message={achievementMessage}
          subMessage={achievementSub}
        />
        
        <FlyingXP 
          trigger={triggerFlyingXP} 
          sourceX={flyingXPSource?.x}
          sourceY={flyingXPSource?.y}
          onComplete={() => setTriggerFlyingXP(false)} 
        />

        {!isInitializing && (
          <div className="pt-8 pb-2 space-y-2 z-10 shrink-0">
            <header className="px-6 flex items-center justify-between">
              <m.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-2xl" />
                  <img src={activeProfile.avatar} alt="Profile" className="relative w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xl" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">{activeProfile.name}</h2>
                  <div className="flex items-center gap-1.5">
                    <CloudLightning size={10} className={isSyncing ? "text-indigo-600 animate-pulse" : "text-slate-300"} />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {isSyncing ? "Cloud Syncing..." : "Ready"}
                    </span>
                  </div>
                </div>
              </m.div>
              <div className="flex items-center gap-2">
                <NavLink to="/rewards" className="p-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-1.5 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                  <Trophy size={14} className="fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{activeProfile.level}</span>
                </NavLink>
                <NavLink to="/profile" className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center gap-2">
                  <Settings2 size={16} />
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
                  currency={activeProfile.currency}
                />} />
                <Route path="/budgets" element={<BudgetsPage 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  budgets={state.budgets.filter(b => b.profileId === state.activeProfileId)}
                  currency={activeProfile.currency}
                  onUpdateBudget={handleUpdateBudget}
                />} />
                <Route path="/history" element={<HistoryPage 
                  transactions={state.transactions.filter(t => t.profileId === state.activeProfileId)}
                  currency={activeProfile.currency}
                  onDeleteTransaction={handleDeleteTransaction}
                />} />
                <Route path="/goals" element={<GoalsPage currency={activeProfile.currency} />} />
                <Route path="/profile" element={<ProfilePage 
                  profiles={state.profiles}
                  activeProfileId={state.activeProfileId}
                  onSwitchProfile={handleSwitchProfile}
                  onSimulateNotification={() => {}}
                  onClaimReward={(amt, msg, x, y) => addXP(amt, msg, undefined, x, y)}
                />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          ) : <SkeletonLoader />}
          <div className="h-40" />
        </main>

        {!isInitializing && (
          <>
            <div className="fixed bottom-32 right-6 z-30">
              <m.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAddModalOpen(true)}
                className="relative w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(99,102,241,0.5)]"
              >
                <Plus size={28} strokeWidth={3} />
              </m.button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
              <nav className="glass-card rounded-[2.5rem] p-3 flex items-center justify-between shadow-xl max-w-sm mx-auto pointer-events-auto">
                {[
                  { to: '/', icon: LayoutGrid, label: 'Home' },
                  { to: '/history', icon: HistoryIcon, label: 'Log' },
                  { to: '/rewards', icon: Trophy, label: 'Rewards' },
                  { to: '/analysis', icon: PieChartIcon, label: 'Insights' },
                  { to: '/profile', icon: Settings2, label: 'App' },
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
