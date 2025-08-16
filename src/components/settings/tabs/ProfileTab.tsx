import React from 'react';
import { Camera, Edit3, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import UserAvatar from '../../profile/UserAvatar';

interface ProfileTabProps {
  userName: string;
}

export default function ProfileTab({ userName }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <UserAvatar name={userName} size="lg" />
            <button className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{userName}</h2>
            <p className="text-gray-500">Compte Kalpé Premium</p>
            <button className="mt-2 flex items-center text-indigo-600 hover:text-indigo-700">
              <Edit3 className="h-4 w-4 mr-1" />
              <span className="text-sm">Modifier le profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-gray-500">+221 77 843 66 74</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-gray-500">Dakar, Sénégal</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Membre depuis</p>
                <p className="text-sm text-gray-500">Janvier 2024</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Statut du compte</h3>
        <p className="text-indigo-100 mb-4">Votre compte est vérifié et actif</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">Niveau de vérification</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Premium</span>
        </div>
      </div>
    </div>
  );
}