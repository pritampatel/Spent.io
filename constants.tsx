
import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Cpu, 
  Activity, 
  Gamepad2, 
  Layers
} from 'lucide-react';
import { Profile } from './types';

export const CATEGORIES: Record<string, { color: string; icon: React.ReactElement }> = {
  Food: { color: 'bg-orange-500/10 text-orange-500', icon: <Utensils size={20} /> },
  Transport: { color: 'bg-blue-500/10 text-blue-500', icon: <Car size={20} /> },
  Shopping: { color: 'bg-pink-500/10 text-pink-500', icon: <ShoppingBag size={20} /> },
  Rent: { color: 'bg-purple-500/10 text-purple-500', icon: <Home size={20} /> },
  Tech: { color: 'bg-slate-500/10 text-slate-500', icon: <Cpu size={20} /> },
  Health: { color: 'bg-red-500/10 text-red-500', icon: <Activity size={20} /> },
  Entertainment: { color: 'bg-emerald-500/10 text-emerald-500', icon: <Gamepad2 size={20} /> },
  Other: { color: 'bg-indigo-500/10 text-indigo-500', icon: <Layers size={20} /> },
};

export const getCategoryMeta = (cat: string) => {
  return CATEGORIES[cat] || { color: 'bg-indigo-500/10 text-indigo-400', icon: <Layers size={20} /> };
};

export const INITIAL_PROFILES: Profile[] = [
  { 
    id: '1', 
    name: 'Main Portfolio', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', 
    xp: 2450, 
    level: 3, 
    streak: 7,
    settings: {
      currency: '$',
      theme: 'system',
      notificationsEnabled: true,
      biometricLock: true,
      aiInsightsFrequency: 'realtime'
    }
  }
];

export const MOCK_TRANSACTIONS = (profileId: string) => [
  { id: 't1', amount: 45.50, category: 'Food', description: 'Artisan Bistro', date: new Date().toISOString(), type: 'expense' as const, profileId },
  { id: 't2', amount: 1250, category: 'Rent', description: 'Central Penthouse', date: new Date().toISOString(), type: 'expense' as const, profileId },
  { id: 't3', amount: 5200, category: 'Other', description: 'Dividends & Yield', date: new Date().toISOString(), type: 'income' as const, profileId },
  { id: 't4', amount: 32.00, category: 'Transport', description: 'Uber Black', date: new Date().toISOString(), type: 'expense' as const, profileId },
];
