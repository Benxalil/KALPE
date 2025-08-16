export interface MoneyPot {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date;
  createdBy: string;
  targetAmount?: number;
  targetDate?: Date;
  currentAmount: number;
  shareLink: string;
  contributors: Contributor[];
  transactions: Transaction[];
  status: 'active' | 'completed' | 'expired';
}

export interface Contributor {
  id: string;
  name: string;
  kalpeAccount: string;
  totalContribution: number;
  lastContribution?: Date;
}

export interface Transaction {
  id: string;
  contributorId: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface CreateMoneyPotForm {
  title: string;
  description: string;
  image?: File;
  unlockType: 'date' | 'amount';
  targetAmount?: number;
  targetDate?: Date;
}

export interface RewardModalProps {
  reward: Reward;
  onClose: () => void;
}

export const REWARD_VALUES = [50, 100, 200, 300, 500, 700] as const;
export type RewardValue = typeof REWARD_VALUES[number];

export interface Vault {
  id: string;
  balance: number;
  unlockType: 'date' | 'amount';
  targetAmount?: number;
  targetDate?: Date;
  transactions: VaultTransaction[];
  status: 'locked' | 'unlocked';
}

export interface VaultTransaction {
  id: string;
  type: 'deposit';
  amount: number;
  date: Date;
  description: string;
}