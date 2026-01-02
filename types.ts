
export type CategoryType = string;

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  description: string;
  date: string;
  type: 'expense' | 'income';
  profileId: string;
}

export interface Budget {
  id: string;
  category: CategoryType;
  limit: number;
  profileId: string;
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  biometricLock: boolean;
  aiInsightsFrequency: 'daily' | 'weekly' | 'realtime';
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  settings: AppSettings;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  profiles: Profile[];
  activeProfileId: string;
}
