import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface PinCodeModalProps {
  onClose: () => void;
}

export default function PinCodeModal({ onClose }: PinCodeModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setError('');
    } else if (!/^\d*$/.test(value)) {
      setError('Veuillez saisir uniquement des chiffres');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Le code doit contenir 4 chiffres');
      return;
    }
    // Handle PIN update logic here
    console.log('PIN updated:', pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Code secret</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau code (4 chiffres)
            </label>
            <input
              type="text"
              id="pin"
              value={pin}
              onChange={handlePinChange}
              className={`block w-full px-4 py-3 rounded-xl border ${
                error ? 'border-red-300' : 'border-gray-200'
              } focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
              placeholder="0000"
              maxLength={4}
            />
            {error && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={pin.length !== 4}
          >
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}