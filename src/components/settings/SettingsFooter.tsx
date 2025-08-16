import React from 'react';
import { LogOut } from 'lucide-react';

export default function SettingsFooter() {
  return (
    <>
      <button className="mt-8 w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm">
        <LogOut className="h-6 w-6 text-gray-600" />
        <span>Se déconnecter (77 843 66 74)</span>
      </button>

      <div className="mt-8 text-center text-sm text-gray-400 space-y-2">
        <p>kalpé digital finance</p>
        <p>Version 24.11.14-212c67</p>
        <div className="flex justify-center space-x-4">
          <button className="hover:text-gray-600">Conditions Générales</button>
          <span>|</span>
          <button className="hover:text-gray-600">Avis de Confidentialité</button>
        </div>
      </div>
    </>
  );
}