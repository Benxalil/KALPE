import React from 'react';
import { Calendar, Target, Share2, Users } from 'lucide-react';
import { MoneyPot } from './types';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MoneyPotCardProps {
  pot: MoneyPot;
}

export default function MoneyPotCard({ pot }: MoneyPotCardProps) {
  const progress = pot.targetAmount 
    ? (pot.currentAmount / pot.targetAmount) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {pot.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={pot.image}
            alt={pot.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{pot.title}</h3>
            <p className="text-sm text-gray-500">{pot.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pot.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : pot.status === 'completed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {pot.status === 'active' ? 'En cours' : pot.status === 'completed' ? 'Terminée' : 'Expirée'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Collecté</span>
            <span className="font-medium">{formatCurrency(pot.currentAmount)}</span>
          </div>
          {pot.targetAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Objectif</span>
              <span className="font-medium">{formatCurrency(pot.targetAmount)}</span>
            </div>
          )}
          {pot.targetDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date limite</span>
              <span className="font-medium">
                {format(pot.targetDate, 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          )}
        </div>

        {pot.targetAmount && (
          <div className="space-y-1">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progress)}%</span>
              <span>{pot.contributors.length} participant{pot.contributors.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Target className="h-4 w-4" />
            <span>Contribuer</span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}