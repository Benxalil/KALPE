import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import CancellationTimer from './CancellationTimer';

interface TransferCancellationProps {
  transferId: string;
  onCancel: () => void;
  onTimeout: () => void;
}

export default function TransferCancellation({ 
  transferId, 
  onCancel, 
  onTimeout 
}: TransferCancellationProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCancelClick = () => {
    setIsConfirming(true);
  };

  const handleConfirmCancel = () => {
    onCancel();
  };

  const handleCancelConfirmation = () => {
    setIsConfirming(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <CancellationTimer duration={300000} onTimeout={onTimeout} />
        {!isConfirming ? (
          <button
            onClick={handleCancelClick}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Annuler le transfert
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirmer l'annulation
            </button>
            <button
              onClick={handleCancelConfirmation}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Retour
            </button>
          </div>
        )}
      </div>
      {isConfirming && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="text-sm">
            Êtes-vous sûr de vouloir annuler ce transfert ? Cette action est irréversible.
          </p>
        </div>
      )}
    </div>
  );
}