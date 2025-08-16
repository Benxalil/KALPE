import React from 'react';
import { Gift } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reward } from './types';

interface RewardItemProps {
  reward: Reward;
  onClick: (reward: Reward) => void;
}

export default function RewardItem({ reward, onClick }: RewardItemProps) {
  const isExpired = new Date() > reward.expiryDate;

  return (
    <button
      onClick={() => reward.isUnlocked && !isExpired && onClick(reward)}
      className={`relative w-full aspect-square rounded-2xl ${
        reward.isUnlocked 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 cursor-pointer'
          : 'bg-gray-200 cursor-not-allowed'
      } ${isExpired ? 'opacity-50' : ''} transition-all duration-300 transform hover:scale-105`}
      disabled={!reward.isUnlocked || isExpired}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <Gift 
          className={`h-16 w-16 mb-4 ${
            reward.isUnlocked ? 'text-white animate-bounce' : 'text-gray-400'
          }`} 
        />
        <p className={`text-sm font-medium ${
          reward.isUnlocked ? 'text-white' : 'text-gray-500'
        }`}>
          {reward.isUnlocked ? 'Ouvrir le cadeau' : 'Débloqué après un paiement de 2000 FCFA'}
        </p>
        <p className="absolute bottom-2 text-xs text-gray-600">
          Expire le {format(reward.expiryDate, 'dd MMMM yyyy', { locale: fr })}
        </p>
      </div>
      
      {reward.isOpened && (
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center">
          <p className="text-gray-400">Cadeau déjà ouvert</p>
        </div>
      )}
    </button>
  );
}