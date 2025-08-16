import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import PaymentForm from './PaymentForm';

interface QRScannerProps {
  onClose: () => void;
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = () => {
    // In a real implementation, this would access the device camera
    // For demo purposes, we'll simulate a successful scan
    setScannedData('recipient-123');
  };

  if (scannedData) {
    return <PaymentForm recipientId={scannedData} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-64 h-64 border-2 border-white rounded-lg relative">
            <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg animate-pulse" />
          </div>
          <p className="mt-4 text-white text-center">
            Placez le QR code dans le cadre
          </p>
          <button
            onClick={handleScan}
            className="mt-8 p-4 bg-white rounded-full"
          >
            <Camera className="h-8 w-8 text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
}