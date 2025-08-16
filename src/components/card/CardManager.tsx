import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Plus, Loader2, ArrowLeft } from 'lucide-react';
import CardView from './CardView';
import PinInput from './PinInput';

interface CardManagerProps {
  onNavigateBack?: () => void;
}

export default function CardManager({ onNavigateBack }: CardManagerProps) {
  const [isCardActivated, setIsCardActivated] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  useEffect(() => {
    // Check if card is already activated
    const activated = localStorage.getItem('cardActivated') === 'true';
    setIsCardActivated(activated);
  }, []);

  const handleActivateCard = async () => {
    setIsActivating(true);
    // Simulate activation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCardActivated(true);
    localStorage.setItem('cardActivated', 'true');
    setIsActivating(false);
  };

  const handlePinSubmit = (enteredPin: string) => {
    if (enteredPin === '1234') { // In a real app, this would be properly secured
      setIsAuthenticated(true);
    } else {
      // Handle incorrect PIN
      alert('Code PIN incorrect');
    }
  };

  if (!isCardActivated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </button>
            <h2 className="text-xl font-semibold">Activer votre carte Kalpé</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleActivateCard}
              disabled={isActivating}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isActivating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Activer ma carte
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </button>
            <h2 className="text-xl font-semibold">Carte Kalpé</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="relative mb-8">
            <div className={`transition-all duration-300 ${showPin ? 'blur-none' : 'blur-md'}`}>
              <CardView />
            </div>
            <button
              onClick={() => setShowPin(!showPin)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            >
              {showPin ? (
                <EyeOff className="h-5 w-5 text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          <PinInput onSubmit={handlePinSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h2 className="text-xl font-semibold">Carte Kalpé</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">Solde disponible</p>
          <p className="text-3xl font-bold">{balance.toLocaleString('fr-FR')} CFA</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {/* Handle top up */}}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Recharger ma carte
          </button>

          <CardView />
        </div>
      </div>
    </div>
  );
}