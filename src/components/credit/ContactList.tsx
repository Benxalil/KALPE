import React from 'react';
import { User } from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';
import { getOperatorInfo } from '../../utils/operator';
import { Contact } from '../../types/contact';

interface ContactListProps {
  searchQuery: string;
  onContactSelect: (contact: Contact) => void;
}

export default function ContactList({ searchQuery, onContactSelect }: ContactListProps) {
  const { contacts, isLoading, error } = useContacts();

  const filteredContacts = contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const getOperatorLogo = (operatorName?: string) => {
    switch (operatorName) {
      case 'Orange':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2048px-Orange_logo.svg.png';
      case 'Free':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Free_logo.svg/1200px-Free_logo.svg.png';
      case 'Expresso':
        return 'https://play-lh.googleusercontent.com/TdM1HpnaHHGlHG3jFHQONFQGQFqOGzbAh5EGPCkGKJVqEHHHfYS8GZx3Jx3bR9dR7g';
      case 'ProMobile':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB-seUVNHHtqBaxe1WZhoQn9-Rw7_L3UGZBA&usqp=CAU';
      default:
        return null;
    }
  };

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

  return (
    <div className="divide-y">
      {filteredContacts?.map((contact) => {
        const operator = getOperatorInfo(contact.phone);
        const logoUrl = getOperatorLogo(operator?.name);

        return (
          <button
            key={contact.id}
            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
            onClick={() => onContactSelect(contact)}
          >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl}
                  alt={operator?.name || 'Operator logo'}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUtdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINmE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjciIHI9IjQiLz48L3N2Zz4=';
                  }}
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 text-left">
              <p className="font-medium">{contact.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">{contact.phone}</p>
                {operator && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${operator.bgColor}`}>
                    {operator.name}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}