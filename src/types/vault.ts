export type VaultPurpose = 'savings' | 'emergency' | 'investment' | 'education' | 'holiday' | 'custom';

export interface Vault {
  id: string;
  userId: string;
  name: string;
  purpose: VaultPurpose;
  balance: number;
  targetAmount?: number;
  color: string;
  icon: string;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultTransaction {
  id: string;
  vaultId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
  createdAt: Date;
}

export interface CreateVaultInput {
  name: string;
  purpose: VaultPurpose;
  targetAmount?: number;
  color: string;
  icon: string;
}

export interface UpdateVaultInput {
  name?: string;
  targetAmount?: number;
  color?: string;
  isLocked?: boolean;
}

export const VAULT_PURPOSES: Record<VaultPurpose, { label: string; emoji: string }> = {
  savings: { label: 'Épargne', emoji: '💰' },
  emergency: { label: 'Urgence', emoji: '🆘' },
  investment: { label: 'Investissement', emoji: '📈' },
  education: { label: 'Éducation', emoji: '📚' },
  holiday: { label: 'Vacances', emoji: '🏖️' },
  custom: { label: 'Personnalisé', emoji: '⭐' }
};

export const VAULT_COLORS = [
  '#4f46e5', // indigo
  '#7c3aed', // violet
  '#db2777', // pink
  '#dc2626', // red
  '#ea580c', // orange
  '#f59e0b', // amber
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6'  // blue
];

export const VAULT_ICONS = [
  'piggy-bank',
  'shield',
  'trending-up',
  'book',
  'umbrella',
  'heart',
  'lock',
  'gift',
  'star'
];
