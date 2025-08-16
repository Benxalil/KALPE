import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Bank, BankListProps } from './types';
import { banks } from './bankData';
import BankItem from './BankItem';
import ComingSoonModal from './ComingSoonModal';

export default function BankList({ onNavigateBack }: BankListProps) {
  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [activeTab, setActiveTab] = useState<'bank' | 'sfd'>('bank');

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b">
        <div className="flex items-center p-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-xl font-semibold ml-4">
            Lier votre banque
          </h1>
        </div>

        <div className="flex px-4 pb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'bank'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('bank')}
          >
            🏛 Banque
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'sfd'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('sfd')}
          >
            💰 SFD
          </button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">
          {activeTab === 'bank' ? 'Banque' : 'SFD'}
        </h2>
        <div className="space-y-4">
          {banks.map((bank) => (
            <BankItem
              key={bank.id}
              bank={bank}
              onClick={setSelectedBank}
            />
          ))}
        </div>
      </div>

      {selectedBank && (
        <ComingSoonModal
          bank={selectedBank}
          onClose={() => setSelectedBank(null)}
        />
      )}
    </div>
  );
}