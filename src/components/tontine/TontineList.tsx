import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import TontineCard from './TontineCard';
import CreateTontineModal from './CreateTontineModal';

// Mock data - In a real app, this would come from an API
const mockTontines = [
  {
    id: '1',
    name: 'Tontine Mensuelle',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    amount: 50000,
    frequency: 'mois',
    memberCount: 12,
    currentMembers: 8,
    startDate: new Date(2024, 2, 1),
    nextUnlock: new Date(2024, 3, 1),
    status: 'open' as const,
  },
  {
    id: '2',
    name: 'Tontine Hebdomadaire',
    amount: 10000,
    frequency: 'semaine',
    memberCount: 10,
    currentMembers: 10,
    startDate: new Date(2024, 1, 15),
    nextUnlock: new Date(2024, 2, 22),
    status: 'in_progress' as const,
  },
];

interface TontineListProps {
  onNavigateBack?: () => void;
}

export default function TontineList({ onNavigateBack }: TontineListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTontines = mockTontines.filter(tontine =>
    tontine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (tontineId: string) => {
    console.log('Joining tontine:', tontineId);
  };

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
        <h1 className="text-2xl font-bold">Tontines</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle Tontine
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une tontine..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTontines.map(tontine => (
          <TontineCard
            key={tontine.id}
            tontine={tontine}
            onJoin={handleJoin}
          />
        ))}
      </div>

      {showCreateModal && (
        <CreateTontineModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            console.log('New tontine:', data);
            setShowCreateModal(false);
          }}
        />
      )}
      </div>
    </div>
  );
}