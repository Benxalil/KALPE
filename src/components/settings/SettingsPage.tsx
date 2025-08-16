import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import SettingsNavigation from './SettingsNavigation';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import NotificationsTab from './tabs/NotificationsTab';
import HelpTab from './tabs/HelpTab';
import GeneralTab from './tabs/GeneralTab';
import StatisticsSection from '../stats/StatisticsSection';
import AgentRegistration from './AgentRegistration';

interface SettingsPageProps {
  userName: string;
  onClose: () => void;
}

export default function SettingsPage({ userName, onClose }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAgentRegistration, setShowAgentRegistration] = useState(false);


  if (showAgentRegistration) {
    return <AgentRegistration onClose={() => setShowAgentRegistration(false)} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab userName={userName} />;
      case 'security':
        return <SecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'help':
        return <HelpTab />;
      case 'general':
        return <GeneralTab />;
      default:
        return <ProfileTab userName={userName} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden flex flex-col">
        <button 
          onClick={() => setShowAgentRegistration(true)}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-300"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-100">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Agent Kalpé</h3>
              <p className="text-sm text-gray-500">Gérer mon compte agent</p>
            </div>
          </div>
        </button>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                aria-label="Retour au tableau de bord"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500">{userName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setShowAgentRegistration(true)}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-green-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Devenir agent</h3>
                  <p className="text-sm text-gray-500">Rejoindre le réseau d'agents</p>
                </div>
              </div>
            </button>

            <button className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Partager l'app</h3>
                  <p className="text-sm text-gray-500">Inviter des amis</p>
                </div>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}