import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Contact } from '../../types/contact';
import { getOperatorInfo } from '../../utils/operator';
import TransferModal from './TransferModal';
import NonKalpeTransfer from '../transfer/NonKalpeTransfer';

interface ContactItemProps {
  contact: Contact;
}

export default function ContactItem({ contact }: ContactItemProps) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showNonKalpeModal, setShowNonKalpeModal] = useState(false);
  const operator = getOperatorInfo(contact.phone);

  const getOperatorLogo = () => {
    switch (operator?.name) {
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

  const logoUrl = getOperatorLogo();

  const handleClick = () => {
    if (contact.hasKalpeAccount) {
      setShowTransferModal(true);
    } else {
      setShowNonKalpeModal(true);
    }
  };

  const handleBackToHome = () => {
    setShowTransferModal(false);
    // Fermer également la liste des contacts pour revenir à l'accueil
    const contactListContainer = document.querySelector('[data-contact-list]');
    if (contactListContainer) {
      const closeButton = contactListContainer.querySelector('button');
      if (closeButton) {
        closeButton.click();
      }
    }
    // Alternative: utiliser un événement personnalisé
    window.dispatchEvent(new CustomEvent('closeContactList'));
  };

  return (
    <>
      <button 
        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
        onClick={handleClick}
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
          <div className="flex items-center space-x-2">
            <span className="font-medium">{contact.name}</span>
            {contact.hasKalpeAccount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                Kalpé
              </span>
            )}
          </div>
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

      {showTransferModal && (
        <TransferModal
          contact={contact}
          onClose={() => setShowTransferModal(false)}
          onBackToHome={handleBackToHome}
        />
      )}

      {showNonKalpeModal && (
        <NonKalpeTransfer
          contact={contact}
          onClose={() => setShowNonKalpeModal(false)}
        />
      )}
    </>
  );
}