import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Hero() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 15000;

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-xl text-white">
        <div className="flex items-start justify-between">
          {/* QR Code - Left Side */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-28 h-28 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                {/* QR Code pattern */}
                <rect x="0" y="0" width="100" height="100" fill="white"/>
                <rect x="0" y="0" width="20" height="20" fill="black"/>
                <rect x="80" y="0" width="20" height="20" fill="black"/>
                <rect x="0" y="80" width="20" height="20" fill="black"/>
                <rect x="5" y="5" width="10" height="10" fill="white"/>
                <rect x="85" y="5" width="10" height="10" fill="white"/>
                <rect x="5" y="85" width="10" height="10" fill="white"/>
                
                {/* Random QR pattern */}
                <rect x="30" y="10" width="5" height="5" fill="black"/>
                <rect x="40" y="10" width="5" height="5" fill="black"/>
                <rect x="50" y="10" width="5" height="5" fill="black"/>
                <rect x="25" y="20" width="5" height="5" fill="black"/>
                <rect x="35" y="20" width="5" height="5" fill="black"/>
                <rect x="45" y="20" width="5" height="5" fill="black"/>
                <rect x="55" y="20" width="5" height="5" fill="black"/>
                <rect x="65" y="20" width="5" height="5" fill="black"/>
                
                <rect x="30" y="30" width="5" height="5" fill="black"/>
                <rect x="40" y="30" width="5" height="5" fill="black"/>
                <rect x="50" y="30" width="5" height="5" fill="black"/>
                <rect x="60" y="30" width="5" height="5" fill="black"/>
                
                <rect x="25" y="40" width="5" height="5" fill="black"/>
                <rect x="35" y="40" width="5" height="5" fill="black"/>
                <rect x="45" y="40" width="5" height="5" fill="black"/>
                <rect x="55" y="40" width="5" height="5" fill="black"/>
                <rect x="65" y="40" width="5" height="5" fill="black"/>
                
                <rect x="30" y="50" width="5" height="5" fill="black"/>
                <rect x="40" y="50" width="5" height="5" fill="black"/>
                <rect x="50" y="50" width="5" height="5" fill="black"/>
                <rect x="60" y="50" width="5" height="5" fill="black"/>
                
                <rect x="25" y="60" width="5" height="5" fill="black"/>
                <rect x="35" y="60" width="5" height="5" fill="black"/>
                <rect x="45" y="60" width="5" height="5" fill="black"/>
                <rect x="55" y="60" width="5" height="5" fill="black"/>
                <rect x="65" y="60" width="5" height="5" fill="black"/>
                
                <rect x="30" y="70" width="5" height="5" fill="black"/>
                <rect x="40" y="70" width="5" height="5" fill="black"/>
                <rect x="50" y="70" width="5" height="5" fill="black"/>
                <rect x="60" y="70" width="5" height="5" fill="black"/>
              </svg>
            </div>
          </div>

          {/* Account Info - Right Side */}
          <div className="flex-1 ml-6">
            {/* Kalpé Logo */}
            <div className="flex justify-end mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-bold text-lg">Kalpé</span>
              </div>
            </div>

            {/* Balance */}
            <div className="text-right mb-2">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-white/80 text-sm">Votre solde est</span>
                <button
                  onClick={toggleBalance}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="text-2xl font-bold text-white">
                {showBalance ? `${formatBalance(balance)} CFA` : '•••••••'}
              </div>
            </div>

            {/* Last Update */}
            <div className="text-right">
              <span className="text-white/70 text-sm">
                Mis à jour: {getCurrentDateTime()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}