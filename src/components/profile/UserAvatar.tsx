import React from 'react';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ name, imageUrl, size = 'md' }: UserAvatarProps) {
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-lg',
    lg: 'h-16 w-16 text-2xl'
  };

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]} bg-indigo-100`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-indigo-600 font-semibold">
          {getInitial(name)}
        </div>
      )}
    </div>
  );
}