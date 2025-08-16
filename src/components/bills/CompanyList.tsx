import React from 'react';
import { Zap, Droplet, Wifi, Phone, Tv, Building } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

const companies: Company[] = [
  {
    id: 'senelec',
    name: 'Senelec',
    description: 'Électricité',
    icon: Zap,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    id: 'woyofal',
    name: 'Woyofal',
    description: 'Compteur électrique prépayé',
    icon: Zap,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'sen-eau',
    name: 'SEN\'EAU',
    description: 'Eau',
    icon: Droplet,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'sonatel',
    name: 'Sonatel',
    description: 'Internet & Téléphone fixe',
    icon: Wifi,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'free-senegal',
    name: 'Free Sénégal',
    description: 'Internet & Téléphone fixe',
    icon: Phone,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: 'canal-plus',
    name: 'Canal+',
    description: 'Télévision',
    icon: Tv,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'sn-hlm',
    name: 'SN HLM',
    description: 'Loyer',
    icon: Building,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
];

interface CompanyListProps {
  onCompanySelect: (companyName: string) => void;
}

export default function CompanyList({ onCompanySelect }: CompanyListProps) {
  return (
    <div className="divide-y">
      {companies.map((company) => {
        const Icon = company.icon;
        return (
          <button
            key={company.id}
            className="w-full px-4 py-3 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
            onClick={() => onCompanySelect(company.name)}
          >
            <div className={`p-3 rounded-xl ${company.bgColor}`}>
              <Icon className={`h-6 w-6 ${company.iconColor}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{company.name}</p>
              <p className="text-sm text-gray-500">{company.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}