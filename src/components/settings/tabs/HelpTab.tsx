import React from 'react';
import { HelpCircle, MessageCircle, Book, Phone, Mail, ExternalLink } from 'lucide-react';

export default function HelpTab() {
  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Aide rapide</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Chat en direct</p>
                <p className="text-sm text-gray-500">Parlez avec notre équipe support</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Book className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Guide d'utilisation</p>
                <p className="text-sm text-gray-500">Apprenez à utiliser Kalpé</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-gray-500">Questions fréquemment posées</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Contacter le support</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-gray-500">+221 33 123 45 67</p>
              </div>
            </div>
            <span className="text-indigo-600 text-sm">Appeler</span>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">support@kalpe.app</p>
              </div>
            </div>
            <span className="text-indigo-600 text-sm">Écrire</span>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Informations sur l'application</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Version</span>
            <span className="font-medium">24.11.14-212c67</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Dernière mise à jour</span>
            <span className="font-medium">14 novembre 2024</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taille de l'app</span>
            <span className="font-medium">45.2 MB</span>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Légal</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium">Conditions d'utilisation</span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium">Politique de confidentialité</span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium">Licences open source</span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}