import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import UserAvatar from './profile/UserAvatar';
import ProfileMenu from './profile/ProfileMenu';
import SettingsPage from './settings/SettingsPage';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export default function Header({ onNavigateHome }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const userName = "John Doe"; // This would come from your user context/state

  return (
    <>
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowProfileMenu(true)}
                className="focus:outline-none"
              >
                <UserAvatar name={userName} />
              </button>
              
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Kalpé
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </nav>

        {showProfileMenu && (
          <ProfileMenu 
            userName={userName}
            onClose={() => setShowProfileMenu(false)}
          />
        )}
      </header>

      {showSettings && (
        <SettingsPage 
          userName={userName}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}