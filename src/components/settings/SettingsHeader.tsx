import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import UserAvatar from '../profile/UserAvatar';

interface SettingsHeaderProps {
  userName: string;
  onClose: () => void;
}

export default function SettingsHeader({ userName, onClose }: SettingsHeaderProps) {
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </button>
            <div className="flex items-center space-x-3">
              <UserAvatar name={userName} size="sm" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500">{userName}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}