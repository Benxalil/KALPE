import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import UserAvatar from './UserAvatar';
import ProfileView from './ProfileView';

interface ProfileMenuProps {
  userName: string;
  onClose: () => void;
}

export default function ProfileMenu({ userName, onClose }: ProfileMenuProps) {
  const [showProfile, setShowProfile] = useState(false);

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle image upload
        console.log('Upload image:', file);
      }
    };
    input.click();
  };

  if (showProfile) {
    return <ProfileView userName={userName} onClose={() => setShowProfile(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="absolute top-16 left-4 w-48 bg-white rounded-xl shadow-lg py-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-2 border-b">
          <UserAvatar name={userName} size="lg" />
          <p className="mt-2 font-medium">{userName}</p>
        </div>
        
        <div className="py-1">
          <button 
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50"
            onClick={() => setShowProfile(true)}
          >
            <User className="h-4 w-4" />
            <span>Voir le profil</span>
          </button>
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50"
            onClick={handleImageSelect}
          >
            <Camera className="h-4 w-4" />
            <span>Modifier le profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}