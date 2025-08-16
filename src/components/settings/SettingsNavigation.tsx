import React from 'react';
import { User, Shield, Bell, HelpCircle, Settings } from 'lucide-react';

interface SettingsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationTabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'help', label: 'Aide', icon: HelpCircle },
  { id: 'general', label: 'Général', icon: Settings },
];

export default function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-1 py-4 min-w-max">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}