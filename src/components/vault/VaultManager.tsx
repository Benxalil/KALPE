import React, { useState } from 'react';
import { X, PiggyBank, Calendar, Target, ArrowUpRight, Clock, Lock, Clock as Unlock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Vault, VaultTransaction } from '../moneypot/types';
import useSound from 'use-sound';

interface VaultManagerProps {
  onNavigateBack?: () => void;
}

export default function VaultManager({ onNavigateBack }: VaultManagerProps) {
  const [vault, setVault] = useState<Vault>(() => {
    const storedVault = localStorage.getItem('vault');
    return storedVault ? JSON.parse(storedVault) : {
      id: 'vault-1',
      balance: 0,
      unlockType: 'date',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      transactions: [],
      status: 'locked'
    };
  });

  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const handleUnlock = () => {
    setVault(prev => ({
      ...prev,
      status: 'unlocked'
    }));
    localStorage.setItem('vault', JSON.stringify({
      ...vault,
      status: 'unlocked'
    }));
  };

  const handleUnlockTypeChange = (type: 'date' | 'amount') => {
    setVault(prev => ({
      ...prev,
      unlockType: type,
      targetAmount: type === 'amount' ? 100000 : undefined,
      targetDate: type === 'date' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    }));
  };

  const handleTargetChange = (value: number | Date) => {
    setVault(prev => ({
      ...prev,
      [prev.unlockType === 'date' ? 'targetDate' : 'targetAmount']: value
    }));
  };

  const handleDeposit = () => {
    const numAmount = Number(amount);
    if (numAmount <= 0) return;

    const newTransaction: VaultTransaction = {
      id: `tr-${Date.now()}`,
      type: 'deposit',
      amount: numAmount,
      date: new Date(),
      description: 'Dépôt dans le coffre'
    };

    const newVault = {
      ...vault,
      balance: vault.balance + numAmount,
      transactions: [newTransaction, ...vault.transactions]
    };

    // Update vault in localStorage
    localStorage.setItem('vault', JSON.stringify(newVault));
    setVault(newVault);

    // Update main balance
    const updateBalance = (window as any).updateBalance;
    if (updateBalance) {
      updateBalance((currentBalance: number) => currentBalance - numAmount);
    }

    setShowSuccess(true);
    playSuccess();
    
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setShowConfirmation(false);
    }, 2000);
  };

  const progress = vault.unlockType === 'amount' && vault.targetAmount
    ? (vault.balance / vault.targetAmount) * 100
    : 0;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <PiggyBank className="h-24 w-24 text-green-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900">Dépôt réussi!</h2>
          <p className="text-gray-600">
            {amount} CFA ont été déposés dans votre coffre
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">Coffre-fort</h1>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Balance Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Solde du coffre</p>
            <p className="text-3xl font-bold">{vault.balance.toLocaleString('fr-FR')} CFA</p>
            
            {vault.status === 'unlocked' && (
              <>
                {vault.unlockType === 'date' && vault.targetDate && (
                  <div className="mt-4 flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Déblocage le {format(new Date(vault.targetDate), 'dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                )}

                {vault.unlockType === 'amount' && vault.targetAmount && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {vault.status === 'locked' ? (
            <div className="text-center space-y-6">
              <div className="p-8 bg-gray-50 rounded-2xl">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Votre coffre est verrouillé
                </p>
                <p className="text-gray-600 mb-6">
                  Déverrouillez votre coffre pour définir les conditions de déblocage et commencer à épargner
                </p>
                <button
                  onClick={handleUnlock}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Unlock className="h-5 w-5 mr-2" />
                  Déverrouiller le coffre
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Deposit Section */}
              {!showConfirmation ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Montant à déposer
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">CFA</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={!amount || Number(amount) <= 0}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Déposer
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-xl text-amber-800">
                    <p className="font-medium mb-2">Confirmation du dépôt</p>
                    <p className="text-sm">
                      Vous êtes sur le point de déposer {Number(amount).toLocaleString('fr-FR')} CFA dans votre coffre.
                      Ce montant sera bloqué jusqu'à ce que les conditions de déblocage soient remplies.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleDeposit}
                      className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Unlock Conditions */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Conditions de déblocage</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    className={`flex items-center justify-center space-x-2 p-4 rounded-xl border ${
                      vault.unlockType === 'date'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => handleUnlockTypeChange('date')}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Par date</span>
                  </button>
                  <button
                    className={`flex items-center justify-center space-x-2 p-4 rounded-xl border ${
                      vault.unlockType === 'amount'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => handleUnlockTypeChange('amount')}
                  >
                    <Target className="h-5 w-5" />
                    <span>Par montant</span>
                  </button>
                </div>

                {vault.unlockType === 'date' && (
                  <input
                    type="date"
                    value={vault.targetDate ? new Date(vault.targetDate).toISOString().split('T')[0] : ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleTargetChange(new Date(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                )}

                {vault.unlockType === 'amount' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={vault.targetAmount || ''}
                      onChange={(e) => handleTargetChange(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Montant cible"
                      min="0"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">CFA</span>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              {vault.transactions.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Historique des dépôts</h2>
                  <div className="space-y-4">
                    {vault.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-green-600">
                          +{transaction.amount.toLocaleString('fr-FR')} CFA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}