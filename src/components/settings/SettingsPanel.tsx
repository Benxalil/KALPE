import React, { useState } from 'react';
import SettingsHeader from './SettingsHeader';
import SettingsNavigation from './SettingsNavigation';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import HelpTab from './tabs/HelpTab';
import GeneralTab from './tabs/GeneralTab';
import StatisticsSection from '../stats/StatisticsSection';
import AgentRegistration from './AgentRegistration';

interface SettingsPanelProps {
  userName: string;
  onClose: () => void;
}

export default function SettingsPanel({ userName, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showStats, setShowStats] = useState(false);
  const [showAgentRegistration, setShowAgentRegistration] = useState(false);

  if (showStats) {
    return <StatisticsSection onClose={() => setShowStats(false)} />;
  }

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
      case 'appearance':
        return <AppearanceTab />;
      case 'help':
        return <HelpTab />;
      case 'general':
        return <GeneralTab />;
      default:
        return <ProfileTab userName={userName} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <SettingsHeader userName={userName} onClose={onClose} />
      <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-lg mx-auto px-4 py-6 pb-20">
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowAgentRegistration(true)}
            className="p-4 bg-white rounded-xl flex items-center space-x-3 hover:bg-gray-50 transition-colors shadow-sm w-full"
          >
            <div className="p-2 rounded-lg bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
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
              <p className="font-medium text-sm">Devenir agent</p>
              <p className="text-xs text-gray-500">Rejoindre le réseau</p>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}