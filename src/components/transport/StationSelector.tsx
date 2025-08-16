import React, { useState } from 'react';
import { ArrowLeft, ArrowLeftRight, MapPin, Clock, Calendar } from 'lucide-react';
import { addHours } from 'date-fns';

interface Transport {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  stations?: string[];
}

interface StationSelectorProps {
  transport: Transport;
  onBack: () => void;
  onClose: () => void;
}

export default function StationSelector({ transport, onBack, onClose }: StationSelectorProps) {
  const [direction, setDirection] = useState<'aller' | 'retour'>('aller');
  const [departStation, setDepartStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [showStationList, setShowStationList] = useState(false);

  if (!transport.stations) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Service bientôt disponible</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
        >
          Retour
        </button>
      </div>
    );
  }

  const stations = direction === 'aller' 
    ? transport.stations 
    : [...transport.stations].reverse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique reference for the ticket
    const reference = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create ticket transaction
    const transaction = {
      id: Date.now(),
      type: 'ticket' as const,
      amount: -500, // Ticket price
      date: new Date(),
      category: 'transport',
      description: `Ticket ${transport.name} - ${departStation} → ${arrivalStation}`,
      details: {
        reference,
        time: new Date().toLocaleTimeString('fr-FR'),
        ticketData: {
          transport: transport.name,
          from: departStation,
          to: arrivalStation,
          qrCode: reference,
          expiresAt: addHours(new Date(), 1)
        }
      }
    };

    // Add transaction to history (in a real app, this would be handled by a state management system)
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    onClose();
  };

  const getStationNumber = (station: string) => {
    return (stations.indexOf(station) + 1).toString().padStart(2, '0');
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto bg-gray-50">
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="p-4 flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à la liste des transports"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{transport.name}</h2>
            <p className="text-sm text-gray-500">{transport.description}</p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-gray-100 p-1 rounded-xl mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button
                className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                  direction === 'aller'
                    ? 'bg-white shadow-sm text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setDirection('aller')}
              >
                Aller
              </button>
              <button
                className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                  direction === 'retour'
                    ? 'bg-white shadow-sm text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setDirection('retour')}
              >
                Retour
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station de départ
                </label>
                <div className="relative">
                  <select
                    value={departStation}
                    onChange={(e) => setDepartStation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Sélectionner une station</option>
                    {stations.map((station) => (
                      <option 
                        key={station} 
                        value={station}
                        disabled={station === arrivalStation}
                      >
                        {station}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <div className="border-4 border-transparent border-t-gray-400" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station d'arrivée
                </label>
                <div className="relative">
                  <select
                    value={arrivalStation}
                    onChange={(e) => setArrivalStation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Sélectionner une station</option>
                    {stations.map((station) => (
                      <option 
                        key={station} 
                        value={station}
                        disabled={station === departStation}
                      >
                        {station}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <div className="border-4 border-transparent border-t-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {departStation && arrivalStation && (
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">
                    {Math.abs(
                      stations.indexOf(departStation) - stations.indexOf(arrivalStation)
                    )} stations
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Durée estimée</span>
                  <div className="flex items-center text-gray-900">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-medium">25 min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Prix du ticket</span>
                  <span className="font-medium text-green-600">500 CFA</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                const temp = departStation;
                setDepartStation(arrivalStation);
                setArrivalStation(temp);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Inverser les stations</span>
            </button>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={!departStation || !arrivalStation}
            >
              Acheter le ticket
            </button>
          </form>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={() => setShowStationList(!showStationList)}
          className="w-full text-left mb-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
        >
          {showStationList ? 'Masquer les stations' : 'Voir toutes les stations'}
        </button>
        
        {showStationList && (
          <div className="space-y-2 animate-fade-in">
            {stations.map((station, index) => (
              <div
                key={station}
                className="p-4 bg-white rounded-xl shadow-sm flex items-center space-x-3 transition-all duration-200 hover:transform hover:translate-x-1"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-medium">
                  {getStationNumber(station)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{station}</p>
                  <p className="text-sm text-gray-500">
                    {index === 0 ? 'Terminus' : `${stations.length - index} stations restantes`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}