import React from 'react';
import { X, Clock } from 'lucide-react';

interface ComingSoonModalProps {
  company: string;
  onClose: () => void;
}

export default function ComingSoonModal({ company, onClose }: ComingSoonModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-indigo-100">
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Bientôt disponible</h3>
            <p className="text-gray-600">
              Le paiement des factures {company} sera bientôt disponible sur notre plateforme.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            D'accord
          </button>
        </div>
      </div>
    </div>
  );
}