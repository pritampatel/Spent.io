
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  PieChart as PieChartIcon, 
  Plus, 
  Target, 
  History as HistoryIcon,
  Settings2,
  Bell,
  Wallet,
  FlaskConical,
  Sparkles,
  CloudLightning
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import BudgetsPage from './pages/Budgets';
import ProfilePage from './pages/Profile';
import HistoryPage from './pages/History';
import GoalsPage from './pages/Goals';
import NotFound from './pages/NotFound';
import AddTransactionModal from './components/AddTransactionModal';
import SplashScreen from './components/SplashScreen';
import SkeletonLoader from './components/SkeletonLoader';
import NotificationToast from './components/NotificationToast';
import XPProgressBar from './components/XPProgressBar';
import FlyingXP from './components/FlyingXP';
import { sounds } from './services/SoundManager';

import { AppState, Transaction, Budget, Profile } from './types';
import { INITIAL_PROFILES, MOCK_TRANSACTIONS } from './constants';

const NavItem: React.FC<{ item: any }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  
  return (
    <NavLink 
      to={item.to} 
      className="flex-1 relative flex flex-col items-center justify-center py-2"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.15 : 1,
          y: isActive ? -4 : 0,
        }}
        className={`flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
      >
        <div className={`p-2.5 rounded-2xl transition-all duration-300 relative ${isActive ? 'bg-indigo-50 shadow-inner' : 'bg-transparent'}`}>
          <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          {item.label === 'App' && !isActive && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
      </motion.div>
    </NavLink>
  );
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [triggerFlyingXP, setTriggerFlyingXP] = useState(false);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('spent_io_state_v2');
    if (saved) return JSON.parse(saved);
    return {
      transactions: MOCK_TRANSACTIONS('1'),
      budgets: [
        { id: 'b1', category: 'Food', limit: 500, profileId: '1' },
      ],
      // Fixed: Removed the redundant .map() call since INITIAL_PROFILES is now correctly typed in constants.tsx
      profiles: INITIAL_PROFILES,
      activeProfileId: '1',
    };
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync effect - only when state data actually changes
  useEffect(() => {
    localStorage.setItem('spent_io_state_v2', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      // Simulate Reward for first login
      setTimeout(() => {
        addXP(100);
        setShowNotification(true);
      }, 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const activeProfile = useMemo(() => 
    state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0], 
  [state]);

  const addXP = (amount: number) => {
    setState(prev => {
      const newProfiles = prev.profiles.map(p => {
        if (p.id === prev.activeProfileId) {
          const newXP = p.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          if (newLevel > p.level) sounds.playLevelUp();
          else sounds.playReward();
          return { ...p, xp: newXP, level: newLevel };
        }
        return p;
      });
      return { ...prev, profiles: newProfiles };
    });
    setTriggerFlyingXP(true);
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
      addXP(50);
      setIsSyncing(false);
      setIsAddModalOpen(false);
    }, 800);
  };

  const handleSwitchProfile = (id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  };

  const triggerNudge = async () => {
    // Check Permission
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        const res = await Notification.requestPermission();
        if (res !== 'granted') {
          // Fallback to in-app toast
          setShowNotification(true);
          return;
        }
      }
      // Simulate real notification
      new Notification("Daily Portfolio Sync", {
        body: "Time to log your evening expenses!",
        icon: activeProfile.avatar
      });
    } else {
      setShowNotification(true);
    }
  };

  return (
    <HashRouter>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.1)] mesh-gradient">
        <AnimatePresence>
          {isInitializing && <SplashScreen key="splash" />}
        </AnimatePresence>

        <NotificationToast isVisible={showNotification} onClose={() => setShowNotification(false)} />
        <FlyingXP trigger={triggerFlyingXP} onComplete={() => setTriggerFlyingXP(false)} />

        {!isInitializing && (
          <div className="pt-8 pb-2 space-y-2 z-10 shrink-0">
            <header className="px-6 flex items-center justify-between">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-2xl" />
                  <img src={activeProfile.avatar} alt="Profile" className="relative w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xl" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">{activeProfile.name}</h2>
                  <div className="flex items-center gap-1.5">
                    <CloudLightning size={10} className={isSyncing ? "text-indigo-600 animate-pulse" : "text-slate-300"} />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {isSyncing ? "Syncing to Cloud..." : "Secure Cloud Active"}
                    </span>
                  </div>
                </div>
              </motion.div>
              <div className="flex items-center gap-2">
                <NavLink to="/profile" className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center gap-2">
                  <FlaskConical size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest px-1">LAB</span>
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
                  onDeleteTransaction={(id) => setState(p => ({...p, transactions: p.transactions.filter(t => t.id !== id)}))}
                />} />
                <Route path="/profile" element={<ProfilePage 
                  profiles={state.profiles}
                  activeProfileId={state.activeProfileId}
                  onSwitchProfile={handleSwitchProfile}
                  onSimulateNotification={triggerNudge}
                  onClaimReward={() => addXP(250)}
                />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          ) : <SkeletonLoader />}
          <div className="h-40" />
        </main>

        {!isInitializing && (
          <>
            <div className="fixed bottom-32 right-6 z-30">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAddModalOpen(true)}
                className="relative w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(99,102,241,0.5)]"
              >
                <Plus size={28} strokeWidth={3} />
              </motion.button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
              <nav className="glass-card rounded-[2.5rem] p-3 flex items-center justify-between shadow-xl max-w-sm mx-auto pointer-events-auto">
                {[
                  { to: '/', icon: LayoutGrid, label: 'Home' },
                  { to: '/history', icon: HistoryIcon, label: 'Log' },
                  { to: '/analysis', icon: PieChartIcon, label: 'Insights' },
                  { to: '/goals', icon: Target, label: 'Goals' },
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
