import React from 'react';
import { Building2, Receipt, UtensilsCrossed, PiggyBank, HeadphonesIcon, Settings } from 'lucide-react';

const tabs = [
  { name: 'Banque', icon: Building2 },
  { name: 'Facture', icon: Receipt },
  { name: 'Resto', icon: UtensilsCrossed },
  { name: 'Cagnotte', icon: PiggyBank },
  { name: 'Service Client', icon: HeadphonesIcon },
  { name: 'Paramètres', icon: Settings },
];

export default function IconTabs() {
  const [activeTab, setActiveTab] = React.useState('Banque');

  return (
    <div className="fixed top-0 right-0 h-screen w-16 flex flex-col items-center py-4 bg-white shadow-lg z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`p-3 rounded-lg mb-2 transition-colors ${
              activeTab === tab.name
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title={tab.name}
          >
            <Icon className="h-6 w-6" />
          </button>
        );
      })}
    </div>
  );
}