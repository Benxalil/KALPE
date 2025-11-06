import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import ContactList from './ContactList';
import RechargeModal from './RechargeModal';
import { Contact } from '../../types/contact';

interface CreditRechargeProps {
  onNavigateBack?: () => void;
}

export default function CreditRecharge({ onNavigateBack }: CreditRechargeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">Recharge de crédit</h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        <ContactList 
          searchQuery={searchQuery}
          onContactSelect={setSelectedContact}
        />
      </div>

      {selectedContact && (
        <RechargeModal
          contact={selectedContact}
          onClose={() => {
            setSelectedContact(null);
            handleClose();
          }}
        />
      )}
    </div>
  );
}