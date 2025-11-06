import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { MoneyPot } from './types';
import MoneyPotCard from './MoneyPotCard';
import CreateMoneyPotModal from './CreateMoneyPotModal';

interface MoneyPotListProps {
  onNavigateBack?: () => void;
}

export default function MoneyPotList({ onNavigateBack }: MoneyPotListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [moneyPots, setMoneyPots] = useState<MoneyPot[]>([]);

  const filteredPots = moneyPots.filter(pot => 
    pot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {onNavigateBack && (
          <div className="mb-6">
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        )}
        
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mes Cagnottes</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle Cagnotte
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une cagnotte..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredPots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune cagnotte trouvée</p>
          </div>
        ) : (
          filteredPots.map(pot => (
            <MoneyPotCard key={pot.id} pot={pot} />
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateMoneyPotModal onClose={() => setShowCreateModal(false)} />
      )}
      </div>
    </div>
  );
}