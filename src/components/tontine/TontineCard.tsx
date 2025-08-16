import React from 'react';
import { Users, Calendar, Banknote } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Tontine {
  id: string;
  name: string;
  image?: string;
  amount: number;
  frequency: string;
  memberCount: number;
  currentMembers: number;
  startDate: Date;
  nextUnlock: Date;
  status: 'open' | 'in_progress' | 'completed';
}

interface TontineCardProps {
  tontine: Tontine;
  onJoin: (tontineId: string) => void;
}

export default function TontineCard({ tontine, onJoin }: TontineCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {tontine.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={tontine.image}
            alt={tontine.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{tontine.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Banknote className="h-4 w-4 mr-1" />
              <span>{formatCurrency(tontine.amount)} / {tontine.frequency}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tontine.status)}`}>
            {getStatusText(tontine.status)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Participants</span>
            </div>
            <span className="font-medium">
              {tontine.currentMembers} / {tontine.memberCount}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Prochain déblocage</span>
            </div>
            <span className="font-medium">
              {format(tontine.nextUnlock, 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>

        {tontine.status === 'open' && (
          <button
            onClick={() => onJoin(tontine.id)}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Rejoindre
          </button>
        )}
      </div>
    </div>
  );
}