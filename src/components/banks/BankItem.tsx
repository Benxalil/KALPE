import React from 'react';
import { Bank } from './types';

interface BankItemProps {
  bank: Bank;
  onClick: (bank: Bank) => void;
}

export default function BankItem({ bank, onClick }: BankItemProps) {
  return (
    <button
      className="flex items-center space-x-4 w-full p-4 hover:bg-gray-50 rounded-xl transition-colors"
      onClick={() => onClick(bank)}
    >
      <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center p-2">
        <img
          src={bank.logo}
          alt={bank.name}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUtbGFuZG1hcmsiPjxwYXRoIGQ9Ik0zIDIxaDR2LTRoNHY0aDR2LTRoNHY0aDR2LTRoNHYtNGgtNHYtNGg0VjVoLTR2LTRoLTR2NGgtNFY1aC00djRoLTRWNUg3djRIM3Y0aDR2NGgtNHY0eiIvPjwvc3ZnPg==';
          }}
        />
      </div>
      <span className="flex-1 text-left">{bank.name}</span>
    </button>
  );
}