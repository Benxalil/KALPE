import React from 'react';
import { X, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface ProfileViewProps {
  userName: string;
  onClose: () => void;
}

export default function ProfileView({ userName, onClose }: ProfileViewProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Profil</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <UserAvatar name={userName} size="lg" />
          <h2 className="mt-4 text-xl font-semibold">{userName}</h2>
          <p className="text-gray-500">Compte Kalpé Premium</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl flex items-center space-x-4">
            <Phone className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">+221 77 843 66 74</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl flex items-center space-x-4">
            <Mail className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">john.doe@example.com</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl flex items-center space-x-4">
            <MapPin className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium">Dakar, Sénégal</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl flex items-center space-x-4">
            <Calendar className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Membre depuis</p>
              <p className="font-medium">Janvier 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}