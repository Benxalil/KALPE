import React from 'react';
import { X, CreditCard } from 'lucide-react';

interface CardScannerProps {
  onClose: () => void;
}

export default function CardScanner({ onClose }: CardScannerProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white">
        <h2 className="text-lg font-medium">Scanner une carte</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-sm aspect-[1.586/1] mb-8">
          <div className="absolute inset-0 border-2 border-white/50 rounded-xl" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 bg-indigo-500 animate-scan-card" />
          </div>
          
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500" />
        </div>

        <div className="text-center text-white space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <p>Placez votre carte dans le cadre</p>
          </div>
          <p className="text-sm text-white/60">
            Assurez-vous que la carte est bien éclairée et lisible
          </p>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="p-6">
        <button
          onClick={onClose}
          className="w-full py-3 bg-white rounded-xl text-gray-900 font-medium"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}