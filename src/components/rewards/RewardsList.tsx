import React, { useState, useEffect } from 'react';
import { addWeeks } from 'date-fns';
import { Reward, REWARD_VALUES } from './types';
import RewardItem from './RewardItem';
import RewardModal from './RewardModal';

function generateRewards(): Reward[] {
  const expiryDate = addWeeks(new Date(), 3);
  
  // Shuffle reward values and add null for "try again"
  const possibleValues = [...REWARD_VALUES, null];
  const shuffledValues = possibleValues
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return shuffledValues.map((value, index) => ({
    id: `reward-${index}`,
    value,
    expiryDate,
    isUnlocked: false,
    isOpened: false,
  }));
}

interface RewardsListProps {
  onNavigateBack?: () => void;
}

export default function RewardsList({ onNavigateBack }: RewardsListProps) {
  const [rewards, setRewards] = useState<Reward[]>(generateRewards);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Simulate unlocking rewards after QR code payment
  useEffect(() => {
    const unlockRewards = (amount: number) => {
      if (amount >= 2000) {
        setRewards(current =>
          current.map(reward => ({
            ...reward,
            isUnlocked: true
          }))
        );
      }
    };

    // Simulate a payment of 2500 FCFA
    unlockRewards(2500);
  }, []);

  const handleRewardClick = (reward: Reward) => {
    if (!reward.isOpened && reward.isUnlocked) {
      setSelectedReward(reward);
      setRewards(current =>
        current.map(r =>
          r.id === reward.id ? { ...r, isOpened: true } : r
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {onNavigateBack && (
          <div className="mb-6">
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        )}
        
        <h2 className="text-2xl font-semibold mb-6">Cadeaux mystères</h2>
        
      <div className="grid grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <RewardItem
            key={reward.id}
            reward={reward}
            onClick={handleRewardClick}
          />
        ))}
      </div>
    </div>

      {selectedReward && (
        <RewardModal
          reward={selectedReward}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
}