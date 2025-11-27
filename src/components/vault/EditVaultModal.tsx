import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vault, VAULT_COLORS, VAULT_ICONS } from '../../types/vault';

interface EditVaultModalProps {
  vault: Vault;
  onClose: () => void;
  onSubmit: (updates: any) => Promise<void>;
  isLoading?: boolean;
}

export default function EditVaultModal({ vault, onClose, onSubmit, isLoading }: EditVaultModalProps) {
  const [formData, setFormData] = useState({
    name: vault.name,
    targetAmount: vault.targetAmount?.toString() || '',
    color: vault.color,
    icon: vault.icon
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Le nom du coffre est requis');
      return;
    }

    if (formData.targetAmount && parseFloat(formData.targetAmount) <= 0) {
      setError('Le montant cible doit être supérieur à 0');
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
        color: formData.color,
        icon: formData.icon
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Modifier le Coffre</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Nom du Coffre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Montant Cible (Optionnel)</label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Couleur</label>
            <div className="grid grid-cols-5 gap-3">
              {VAULT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`h-10 rounded-lg border-2 transition-transform ${
                    formData.color === color ? 'border-black scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Icône</label>
            <div className="grid grid-cols-5 gap-3">
              {VAULT_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.icon === icon
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center text-lg">{getIconEmoji(icon)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mise à jour...
                </span>
              ) : (
                'Mettre à jour'
              )}
            </button>
          </div>
        </form>
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
