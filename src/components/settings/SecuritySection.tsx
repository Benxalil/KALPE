import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import PinCodeModal from './PinCodeModal';

export default function SecuritySection() {
  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-lg text-gray-500 mb-4">Sécurité</h2>
        <button 
          onClick={() => setShowPinModal(true)}
          className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Shield className="h-6 w-6 text-gray-600" />
          <span>Modifiez votre code secret</span>
        </button>
      </div>

      {showPinModal && (
        <PinCodeModal onClose={() => setShowPinModal(false)} />
      )}
    </>
  );
}