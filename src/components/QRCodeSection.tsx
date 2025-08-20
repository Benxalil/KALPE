import React, { useEffect, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import ScanButton from './scanner/ScanButton';
import CardScanner from './scanner/CardScanner';

export default function QRCodeSection() {
  const [isScanning, setIsScanning] = useState<'qr' | 'card' | null>(null);

  return (
    <div className="flex flex-col items-center py-4">
      {/* QR Code refresh indicator */}
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        <span>Code actualisé toutes les 30 secondes</span>
      </div>

      {isScanning === 'qr' && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-2 border-white/50 rounded-lg" />
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-0.5 bg-indigo-500 animate-scan" />
            </div>
            <button
              onClick={() => setIsScanning(null)}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full text-gray-900 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {isScanning === 'card' && (
        <CardScanner onClose={() => setIsScanning(null)} />
      )}
    </div>
  );
}