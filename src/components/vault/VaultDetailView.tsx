import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Lock, Unlock, Edit2 } from 'lucide-react';
import { Vault, VaultTransaction, VAULT_PURPOSES } from '../../types/vault';

interface VaultDetailViewProps {
  vault: Vault;
  transactions: VaultTransaction[];
  onBack: () => void;
  onDeposit: (amount: number, description?: string) => Promise<void>;
  onWithdraw: (amount: number, description?: string) => Promise<void>;
  onToggleLock: (isLocked: boolean) => Promise<void>;
  onEdit: () => void;
  isLoading?: boolean;
}

export default function VaultDetailView({
  vault,
  transactions,
  onBack,
  onDeposit,
  onWithdraw,
  onToggleLock,
  onEdit,
  isLoading
}: VaultDetailViewProps) {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const purposeInfo = VAULT_PURPOSES[vault.purpose];
  const progressPercent = vault.targetAmount
    ? Math.min((vault.balance / vault.targetAmount) * 100, 100)
    : 0;

  const handleDeposit = async () => {
    try {
      setError(null);
      if (!amount || parseFloat(amount) <= 0) {
        setError('Montant invalide');
        return;
      }
      setTransactionLoading(true);
      await onDeposit(parseFloat(amount), description || undefined);
      setAmount('');
      setDescription('');
      setShowDepositForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setError(null);
      if (!amount || parseFloat(amount) <= 0) {
        setError('Montant invalide');
        return;
      }
      setTransactionLoading(true);
      await onWithdraw(parseFloat(amount), description || undefined);
      setAmount('');
      setDescription('');
      setShowWithdrawForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-semibold">{vault.name}</h1>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div
          className="rounded-2xl p-6 text-white mb-6"
          style={{ backgroundColor: vault.color }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Solde Actuel</p>
              <p className="text-4xl font-bold">{vault.balance.toLocaleString('fr-FR')}</p>
              <p className="text-white/60 text-xs mt-2">{purposeInfo.label}</p>
            </div>
            <div className="text-4xl">{getIconEmoji(vault.icon)}</div>
          </div>

          {vault.targetAmount && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/80">Objectif</span>
                <span className="text-sm font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-white transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-white/70 mt-2">
                {vault.targetAmount.toLocaleString('fr-FR')} CFA
              </p>
            </div>
          )}

          {vault.isLocked && (
            <div className="flex items-center gap-2 mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium">Coffre Verrouillé</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => {
              setShowDepositForm(true);
              setShowWithdrawForm(false);
              setError(null);
            }}
            className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex flex-col items-center space-y-2 hover:bg-green-100 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-900">Dépôt</span>
          </button>

          <button
            onClick={() => {
              setShowWithdrawForm(true);
              setShowDepositForm(false);
              setError(null);
            }}
            disabled={vault.isLocked}
            className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 flex flex-col items-center space-y-2 hover:bg-orange-100 transition-colors disabled:opacity-50"
          >
            <div className="bg-orange-100 p-3 rounded-lg">
              <Minus className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-900">Retrait</span>
          </button>
        </div>

        <button
          onClick={() => onToggleLock(!vault.isLocked)}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            vault.isLocked
              ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          } disabled:opacity-50`}
        >
          {vault.isLocked ? (
            <div className="flex items-center justify-center gap-2">
              <Unlock className="h-5 w-5" />
              Déverrouiller
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Verrouiller
            </div>
          )}
        </button>

        {(showDepositForm || showWithdrawForm) && (
          <div className="bg-white rounded-xl p-4 mt-6 border border-gray-200">
            <h3 className="font-semibold mb-4">
              {showDepositForm ? 'Ajouter un Dépôt' : 'Effectuer un Retrait'}
            </h3>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optionnel)"
              className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              rows={2}
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDepositForm(false);
                  setShowWithdrawForm(false);
                  setAmount('');
                  setDescription('');
                  setError(null);
                }}
                className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={showDepositForm ? handleDeposit : handleWithdraw}
                disabled={transactionLoading}
                className={`flex-1 px-3 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  showDepositForm
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {transactionLoading ? 'En cours...' : 'Confirmer'}
              </button>
            </div>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Historique</h3>
            <div className="space-y-2">
              {transactions.map(trans => (
                <div key={trans.id} className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          trans.type === 'deposit'
                            ? 'bg-green-100'
                            : 'bg-orange-100'
                        }`}
                      >
                        {trans.type === 'deposit' ? (
                          <Plus className={`h-5 w-5 text-green-600`} />
                        ) : (
                          <Minus className={`h-5 w-5 text-orange-600`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {trans.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                        </p>
                        {trans.description && (
                          <p className="text-xs text-gray-500 truncate">{trans.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p
                        className={`text-sm font-semibold ${
                          trans.type === 'deposit'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {trans.type === 'deposit' ? '+' : '-'}
                        {trans.amount.toLocaleString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trans.createdAt.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getIconEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    'piggy-bank': '🐷',
    'shield': '��️',
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
