import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import PaymentCategories from './PaymentCategories';
import ServicesList from './ServicesList';

interface PaymentSectionProps {
  onNavigateBack?: () => void;
}

export default function PaymentSection({ onNavigateBack }: PaymentSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h2 className="text-xl font-semibold">Paiements</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <PaymentCategories
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <div className="h-px bg-gray-200 mx-4" />
        <ServicesList selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}