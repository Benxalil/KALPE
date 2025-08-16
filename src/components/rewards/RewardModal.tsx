import React, { useState, useEffect } from 'react';
import { X, Gift, PartyPopper } from 'lucide-react';
import { RewardModalProps } from './types';
import { formatCurrency } from '../../utils/currency';

export default function RewardModal({ reward, onClose }: RewardModalProps) {
  const [isOpening, setIsOpening] = useState(true);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
      setShowReward(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {isOpening ? (
            <>
              <div className="w-32 h-32 animate-bounce">
                <Gift className="w-full h-full text-yellow-500" />
              </div>
              <p className="text-xl font-semibold">Ouverture du cadeau...</p>
            </>
          ) : (
            <>
              <div className={`transform transition-all duration-1000 ${
                showReward ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                {reward.value ? (
                  <>
                    <PartyPopper className="w-16 h-16 text-yellow-500 animate-bounce" />
                    <h3 className="text-2xl font-bold mt-4">
                      Félicitations !
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Vous avez gagné
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {formatCurrency(reward.value)}
                    </p>
                  </>
                ) : (
                  <>
                    <Gift className="w-16 h-16 text-gray-400" />
                    <p className="text-xl text-gray-600 mt-4">
                      Réessayez une prochaine fois !
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}