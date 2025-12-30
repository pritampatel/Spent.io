
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  completed: boolean;
  category: 'daily' | 'milestone' | 'social';
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  currency: string;
  xp: number;
  level: number;
  streak: number;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  profiles: Profile[];
  activeProfileId: string;
}
