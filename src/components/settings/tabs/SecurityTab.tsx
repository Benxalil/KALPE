import React, { useState } from 'react';
import { Shield, Key, Smartphone, Eye, AlertTriangle } from 'lucide-react';
import PinCodeModal from '../PinCodeModal';

export default function SecurityTab() {
  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Security Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Compte sécurisé</h3>
              <p className="text-green-700">Toutes les mesures de sécurité sont activées</p>
            </div>
          </div>
        </div>

        {/* Security Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Options de sécurité</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setShowPinModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium">Code secret</p>
                  <p className="text-sm text-gray-500">Modifier votre code PIN</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-green-600">Configuré</span>
              </div>
            </button>

            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Authentification biométrique</p>
                  <p className="text-sm text-gray-500">Empreinte digitale ou reconnaissance faciale</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Connexions récentes</p>
                  <p className="text-sm text-gray-500">Voir l'activité de votre compte</p>
                </div>
              </div>
              <span className="text-indigo-600 text-sm">Voir</span>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Conseils de sécurité</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Ne partagez jamais votre code PIN</li>
                <li>• Utilisez l'authentification biométrique quand possible</li>
                <li>• Vérifiez régulièrement l'activité de votre compte</li>
                <li>• Contactez-nous immédiatement en cas d'activité suspecte</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPinModal && (
        <PinCodeModal onClose={() => setShowPinModal(false)} />
      )}
    </>
  );
}