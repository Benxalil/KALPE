import React from 'react';
import { Lock, Trash2, Edit2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Vault, VAULT_PURPOSES } from '../../types/vault';

interface VaultCardProps {
  vault: Vault;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VaultCard({ vault, onClick, onEdit, onDelete }: VaultCardProps) {
  const purposeInfo = VAULT_PURPOSES[vault.purpose];
  const progressPercent = vault.targetAmount
    ? Math.min((vault.balance / vault.targetAmount) * 100, 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: vault.color + '20' }}
            >
              {getIconEmoji(vault.icon)}
            </div>
            {vault.isLocked && <Lock className="h-4 w-4 text-red-500" />}
          </div>
          <h3 className="font-semibold text-gray-900">{vault.name}</h3>
          <p className="text-xs text-gray-500">{purposeInfo.label}</p>
        </div>

        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-gray-600">Solde</span>
            <span className="text-lg font-bold" style={{ color: vault.color }}>
              {vault.balance.toLocaleString('fr-FR')} CFA
            </span>
          </div>
          {vault.targetAmount && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                Objectif: {vault.targetAmount.toLocaleString('fr-FR')} CFA
              </span>
              <span className="text-xs font-medium text-gray-600">
                {Math.round(progressPercent)}%
              </span>
            </div>
          )}
          {vault.targetAmount && (
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: vault.color
                }}
              />
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Créé le</span>
            <span className="text-gray-900 font-medium">
              {vault.createdAt.toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIconEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    'piggy-bank': '🐷',
    'shield': '🛡️',
    'trending-up': '📈',
    'book': '📚',
    'umbrella': '☂️',
    'heart': '❤️',
    'lock': '🔒',
    'gift': '🎁',
    'star': '⭐'
  };
  return iconMap[icon] || '💰';
}
