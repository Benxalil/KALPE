import React, { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';

export default function PinCode() {
  const [pin, setPin] = useState('');
  const [dots, setDots] = useState<boolean[]>([false, false, false, false]);
  const phoneNumber = '77 84 •• 74';

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      const newDots = dots.map((_, index) => index < newPin.length);
      setDots(newDots);

      if (newPin.length === 4) {
        // Handle PIN verification here
        console.log('PIN entered:', newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      const newPin = pin.slice(0, -1);
      setPin(newPin);
      const newDots = dots.map((_, index) => index < newPin.length);
      setDots(newDots);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-end">
        <span className="text-gray-800">{phoneNumber}</span>
      </div>

      {/* Logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img
          src="https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=128&h=128&fit=crop"
          alt="Logo"
          className="w-24 h-24 mb-8"
        />
        
        <h1 className="text-xl text-center mb-12">
          Votre code secret est requis pour déverrouiller
        </h1>

        {/* PIN dots */}
        <div className="flex space-x-4 mb-16">
          {dots.map((filled, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                filled ? 'bg-blue-500' : 'bg-blue-200'
              }`}
            />
          ))}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className="w-16 h-16 text-2xl font-medium text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              {number}
            </button>
          ))}
          <button className="w-16 h-16 text-sm font-medium text-gray-800">
            OUBLIÉ?
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 text-2xl font-medium text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            0
          </button>
          <button className="w-16 h-16 flex items-center justify-center text-gray-800">
            <Fingerprint className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}