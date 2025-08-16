import React from 'react';
import { X, Clock } from 'lucide-react';
import { ComingSoonModalProps } from './types';

export default function ComingSoonModal({ bank, onClose }: ComingSoonModalProps) {
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
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center p-2">
            <img
              src={bank.logo}
              alt={bank.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUtbGFuZG1hcmsiPjxwYXRoIGQ9Ik0zIDIxaDR2LTRoNHY0aDR2LTRoNHY0aDR2LTRoNHYtNGgtNHYtNGg0VjVoLTR2LTRoLTR2NGgtNFY1aC00djRoLTRWNUg3djRIM3Y0aDR2NGgtNHY0eiIvPjwvc3ZnPg==';
              }}
            />
          </div>
          
          <div className="p-4 rounded-full bg-indigo-100">
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Bientôt disponible</h3>
            <p className="text-gray-600">
              La connexion avec {bank.name} sera bientôt disponible sur notre plateforme.
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