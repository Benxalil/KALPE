import React, { useState } from 'react';
import { X, Bus, Train, ArrowLeft } from 'lucide-react';
import StationSelector from './StationSelector';

interface TransportListProps {
  onNavigateBack?: () => void;
}

const transportOptions = [
  {
    id: 'brt',
    name: 'BRT',
    description: 'Bus Rapid Transit',
    icon: Bus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    stations: [
      'Papa Gueye Fall (Petersen)',
      'Place de la Nation',
      'Grand Dakar',
      'Sacré Cœur',
      'Liberté 6',
      'Khar Yalla',
      'Front de Terre',
      'Grand Médine',
      'HLM Grand Yoff',
      'Parcelles Assainies',
      'Unité 17',
      'Dalal Diam',
      'Golf Nord',
      'Préfecture de Guédiawaye'
    ]
  },
  {
    id: 'ter',
    name: 'TER',
    description: 'Train Express Régional',
    icon: Train,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    stations: [
      'Dakar',
      'Colobane',
      'Hann',
      'Dalifort',
      'Beaux Maraîchers',
      'Pikine',
      'Thiaroye',
      'Yeumbeul',
      'Keur Massar',
      'Mbao',
      'PNR',
      'Rufisque',
      'Bargny',
      'Diamniadio',
      'Aéroport International Blaise-Diagne (AIBD)'
    ]
  },
  {
    id: 'ddd',
    name: 'Dakar Dem Dikk',
    description: 'Transport urbain',
    icon: Bus,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 'sdd',
    name: 'Sénégal Dem Dikk',
    description: 'Transport interurbain',
    icon: Bus,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  }
];

export default function TransportList({ onNavigateBack }: TransportListProps) {
  const [selectedTransport, setSelectedTransport] = useState<typeof transportOptions[0] | null>(null);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!selectedTransport ? (
        <>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </button>
              <h2 className="text-xl font-semibold">Transport</h2>
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
              {transportOptions.map((option) => (
                <button
                  key={option.id}
                  className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={() => setSelectedTransport(option)}
                >
                  <div className={`p-3 rounded-xl ${option.bgColor}`}>
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <StationSelector
          transport={selectedTransport}
          onBack={() => setSelectedTransport(null)}
          onClose={handleClose}
        />
      )}
    </div>
  );
}