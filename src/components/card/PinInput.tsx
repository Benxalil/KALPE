import React, { useState } from 'react';

interface PinInputProps {
  onSubmit: (pin: string) => void;
}

export default function PinInput({ onSubmit }: PinInputProps) {
  const [pin, setPin] = useState('');

  const handlePinChange = (value: string) => {
    if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);
      
      if (newPin.length === 4) {
        onSubmit(newPin);
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < pin.length ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handlePinChange(num.toString())}
            className="w-16 h-16 rounded-full bg-gray-50 hover:bg-gray-100 text-xl font-medium transition-colors"
          >
            {num}
          </button>
        ))}
        <button className="w-16 h-16 text-sm font-medium text-gray-600">
          OUBLIÉ?
        </button>
        <button
          onClick={() => handlePinChange('0')}
          className="w-16 h-16 rounded-full bg-gray-50 hover:bg-gray-100 text-xl font-medium transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full bg-gray-50 hover:bg-gray-100 text-xl font-medium transition-colors"
        >
          ←
        </button>
      </div>
    </div>
  );
}