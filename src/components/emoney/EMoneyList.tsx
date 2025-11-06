import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import EMoneyTransfer from './EMoneyTransfer';

interface EMoneyListProps {
  onNavigateBack?: () => void;
}

const operators = [
  {
    id: 'wave',
    name: 'Wave',
    logo: 'https://play-lh.googleusercontent.com/vpPqRqKOoiY8_KJdZa-Iz6_ZWBVvhzTt6y0X9i4mXlGJTxLEQT_pDeJIl5qGHxzXZQ',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    logo: 'https://play-lh.googleusercontent.com/Cl8t0_O4Jh6hcwwWxRe5UuQjkgdXRDkxvqRZE2MiAzKaZGHEeYJ_snjr4ZRwC6zqhQ',
    color: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
  {
    id: 'yas',
    name: 'Yas',
    logo: 'https://play-lh.googleusercontent.com/Qh9j0_dH7KNe5mxhqWPkVZEWqj4Yl_zrAC9YEgXv8-FUDxFhOTZBZmmdHhZnXCvNrw',
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    id: 'kpay',
    name: 'KPay',
    logo: 'https://play-lh.googleusercontent.com/yPOIQqR5yHw0Jc_wZoQk_Q9sTvV1qXNTWQiVtHHAD8vW0YsTCQz_Cx5PyOxT1rSZ0vk',
    color: 'bg-green-100',
    textColor: 'text-green-600',
  },
];

export default function EMoneyList({ onNavigateBack }: EMoneyListProps) {
  const [selectedOperator, setSelectedOperator] = useState<typeof operators[0] | null>(null);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!selectedOperator ? (
        <>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">E-Money</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid gap-4">
              {operators.map((operator) => (
                <button
                  key={operator.id}
                  className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={() => setSelectedOperator(operator)}
                >
                  <div className={`h-12 w-12 rounded-xl overflow-hidden ${operator.color}`}>
                    <img
                      src={operator.logo}
                      alt={operator.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${operator.textColor}`}>{operator.name}</p>
                    <p className="text-sm text-gray-500">Transfert d'argent</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EMoneyTransfer
          operator={selectedOperator}
          onBack={() => setSelectedOperator(null)}
          onClose={handleClose}
        />
      )}
    </div>
  );
}