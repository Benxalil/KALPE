export interface Reward {
  id: string;
  value: number | null;
  expiryDate: Date;
  isUnlocked: boolean;
  isOpened: boolean;
}

export interface RewardModalProps {
  reward: Reward;
  onClose: () => void;
}

export const REWARD_VALUES = [50, 100, 200, 300, 500, 700] as const;
export type RewardValue = typeof REWARD_VALUES[number];