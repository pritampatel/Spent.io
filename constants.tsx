
import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Cpu, 
  Activity, 
  Gamepad2, 
  Layers,
  LucideIcon
} from 'lucide-react';
import { Profile } from './types';

// Updated: Changed icon type from React.ReactNode to React.ReactElement to fix type errors when using cloneElement
export const CATEGORIES: Record<string, { color: string; icon: React.ReactElement }> = {
  Food: { color: 'bg-orange-100 text-orange-600', icon: <Utensils size={20} /> },
  Transport: { color: 'bg-blue-100 text-blue-600', icon: <Car size={20} /> },
  Shopping: { color: 'bg-pink-100 text-pink-600', icon: <ShoppingBag size={20} /> },
  Rent: { color: 'bg-purple-100 text-purple-600', icon: <Home size={20} /> },
  Tech: { color: 'bg-slate-100 text-slate-600', icon: <Cpu size={20} /> },
  Health: { color: 'bg-red-100 text-red-600', icon: <Activity size={20} /> },
  Entertainment: { color: 'bg-emerald-100 text-emerald-600', icon: <Gamepad2 size={20} /> },
  Other: { color: 'bg-gray-100 text-gray-600', icon: <Layers size={20} /> },
};

export const getCategoryMeta = (cat: string) => {
  return CATEGORIES[cat] || { color: 'bg-indigo-50 text-indigo-400', icon: <Layers size={20} /> };
};

// Fixed: Added xp, level, and streak properties to comply with the Profile interface
export const INITIAL_PROFILES: Profile[] = [
  { id: '1', name: 'Personal', avatar: 'https://picsum.photos/seed/p1/200', currency: '$', xp: 50, level: 1, streak: 1 },
  { id: '2', name: 'Work', avatar: 'https://picsum.photos/seed/p2/200', currency: '$', xp: 50, level: 1, streak: 1 },
];

export const MOCK_TRANSACTIONS = (profileId: string) => [
  { id: 't1', amount: 45.50, category: 'Food', description: 'Sushico Dinner', date: new Date().toISOString(), type: 'expense' as const, profileId },
  { id: 't2', amount: 1200, category: 'Rent', description: 'Monthly Rent', date: new Date().toISOString(), type: 'expense' as const, profileId },
  { id: 't3', amount: 3500, category: 'Other', description: 'Salary Deposit', date: new Date().toISOString(), type: 'income' as const, profileId },
  { id: 't4', amount: 25.00, category: 'Transport', description: 'Uber Ride', date: new Date().toISOString(), type: 'expense' as const, profileId },
];
