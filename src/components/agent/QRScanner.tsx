import React, { useState, useEffect } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate camera access
    setIsScanning(true);
    
    // Simulate QR code detection after 3 seconds
    const timer = setTimeout(() => {
      // Simulate successful scan with mock data
      const mockQRData = 'kalpe://user/mock-user-id-123';
      onScan(mockQRData);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onScan]);

  const handleManualInput = () => {
    const input = prompt('Entrez le code Kalpé du client:');
    if (input) {
      onScan(`kalpe://user/${input}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white">
        <h2 className="text-lg font-medium">Scanner QR Code Client</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 border-2 border-white/50 rounded-xl" />
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-1 bg-indigo-500 animate-scan-qr" />
            </div>
          )}
          
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500" />
        </div>

        <div className="text-center text-white space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Camera className="h-6 w-6" />
            <p>Placez le QR code du client dans le cadre</p>
          </div>
          <p className="text-sm text-white/60">
            Le scan se fera automatiquement
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-4">
        <button
          onClick={handleManualInput}
          className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          Saisie manuelle du code
        </button>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-white rounded-xl text-gray-900 font-medium"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}