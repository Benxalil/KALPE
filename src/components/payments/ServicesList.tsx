import React from 'react';
import { UtensilsCrossed, ShoppingBag, Palmtree } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
}

const services: Service[] = [
  // Restaurants
  {
    id: 'resto-1',
    name: 'Le Petit Bistrot',
    category: 'restaurant',
    description: 'Cuisine française',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'resto-2',
    name: 'Sushi Palace',
    category: 'restaurant',
    description: 'Cuisine japonaise',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  // Boutiques
  {
    id: 'shop-1',
    name: 'City Market',
    category: 'shopping',
    description: 'Supermarché',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'shop-2',
    name: 'Fashion Store',
    category: 'shopping',
    description: 'Vêtements',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  // Tourisme
  {
    id: 'tour-1',
    name: 'Beach Resort',
    category: 'tourism',
    description: 'Hôtel en bord de mer',
    logo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'tour-2',
    name: 'City Tours',
    category: 'tourism',
    description: 'Visites guidées',
    logo: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
];

interface ServicesListProps {
  selectedCategory: string | null;
}

export default function ServicesList({ selectedCategory }: ServicesListProps) {
  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  if (filteredServices.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Aucun service disponible dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            className="flex items-center space-x-4 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={service.logo}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}