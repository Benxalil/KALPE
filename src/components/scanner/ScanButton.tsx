import React from 'react';
import { Camera, CreditCard } from 'lucide-react';

interface ScanButtonProps {
  icon: 'qr' | 'card';
  label: string;
  onClick: () => void;
}

export default function ScanButton({ icon, label, onClick }: ScanButtonProps) {
  const Icon = icon === 'qr' ? Camera : CreditCard;
  
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-200"
      aria-label={label}
    >
      <Icon className="h-5 w-5 text-indigo-600" />
      <span className="text-sm font-medium text-indigo-600">{label}</span>
    </button>
  );
}