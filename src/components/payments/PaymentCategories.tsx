import React from 'react';
import { UtensilsCrossed, ShoppingBag, Palmtree, Search } from 'lucide-react';

const categories = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: UtensilsCrossed,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  {
    id: 'shopping',
    name: 'Boutique',
    icon: ShoppingBag,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'tourism',
    name: 'Tourisme',
    icon: Palmtree,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
];

interface PaymentCategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export default function PaymentCategories({ selectedCategory, onCategorySelect }: PaymentCategoriesProps) {
  return (
    <div className="px-4 py-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Chercher par nom"
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              className={`flex flex-col items-center space-y-2 ${
                isSelected ? 'opacity-100' : 'opacity-60'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={`p-4 rounded-xl ${category.bgColor} ${
                isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
              }`}>
                <Icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <span className="text-sm text-gray-600">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}