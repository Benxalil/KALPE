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
          <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center">
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
            
            {/* Camera Icon - Outside QR field but inside card */}
            <div className="mt-4">
            <button 
              className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors"
              onClick={() => {
                // TODO: Implement QR scanner functionality
                console.log('Opening QR scanner...');
              }}
              aria-label="Scanner un QR code"
            >
              <svg 
                className="w-5 h-5 text-indigo-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </button>
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