import React, { useState, useEffect } from 'react';
import { Search, User, ArrowLeft } from 'lucide-react';
import ContactItem from './ContactItem';
import { useContacts } from '../../hooks/useContacts';

interface ContactListProps {
  onNavigateBack?: () => void;
}

export default function ContactList({ onNavigateBack }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts, isLoading, error } = useContacts();

  const filteredContacts = contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  // Écouter l'événement personnalisé pour fermer la liste
  useEffect(() => {
    const handleCloseContactList = () => {
      // Fermer la liste des contacts
      const event = new CustomEvent('closeAllModals');
      window.dispatchEvent(event);
    };

    window.addEventListener('closeContactList', handleCloseContactList);
    return () => window.removeEventListener('closeContactList', handleCloseContactList);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Une erreur est survenue lors du chargement des contacts
      </div>
    );
  }

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  return (
    <div className="min-h-screen bg-white" data-contact-list>
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleClose}
           className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group flex items-center justify-center"
            aria-label="Retour à l'accueil"
          >
           <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
          </button>
         <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">Contacts</h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
           className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-y-auto h-full">
        {filteredContacts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <User className="h-12 w-12 mb-2" />
            <p>Aucun contact trouvé</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredContacts?.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}