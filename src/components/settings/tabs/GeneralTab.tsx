import React from 'react';
import { Globe, Download, Trash2, RotateCcw, LogOut, Smartphone } from 'lucide-react';

export default function GeneralTab() {
  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Langue et région</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Langue</p>
                <p className="text-sm text-gray-500">Français</p>
              </div>
            </div>
            <span className="text-indigo-600 text-sm">Modifier</span>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Région</p>
                <p className="text-sm text-gray-500">Sénégal</p>
              </div>
            </div>
            <span className="text-indigo-600 text-sm">Modifier</span>
          </div>
        </div>
      </div>

      {/* Data & Storage */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Données et stockage</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Exporter mes données</p>
                <p className="text-sm text-gray-500">Télécharger une copie de vos données</p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div className="text-left">
                <p className="font-medium">Vider le cache</p>
                <p className="text-sm text-gray-500">Libérer de l'espace de stockage</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Device Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Gestion des appareils</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Cet appareil</p>
                <p className="text-sm text-green-700">iPhone 15 Pro • Actif maintenant</p>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-left">
              <p className="font-medium">Gérer les appareils connectés</p>
              <p className="text-sm text-gray-500">Voir et déconnecter d'autres appareils</p>
            </div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Actions du compte</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium">Réinitialiser les paramètres</p>
                <p className="text-sm text-gray-500">Restaurer les paramètres par défaut</p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-lg transition-colors text-red-600">
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Se déconnecter</p>
                <p className="text-sm text-red-500">Déconnexion de tous les appareils</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Informations sur l'application</h3>
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/statistiques'}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div className="text-left">
                <p className="font-medium">Statistiques</p>
                <p className="text-sm text-gray-500">Voir mes données d'utilisation</p>
              </div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div className="text-left">
                <p className="font-medium">Tableau de bord Agent</p>
                <p className="text-sm text-gray-500">Gérer mon activité d'agent</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-sm text-gray-400 space-y-2">
        <p>kalpé digital finance</p>
        <p>Version 24.11.14-212c67</p>
      </div>
    </div>
  );
}