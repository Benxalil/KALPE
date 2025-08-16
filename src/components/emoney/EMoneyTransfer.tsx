import React, { useState } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import useSound from 'use-sound';

interface EMoneyTransferProps {
  operator: {
    id: string;
    name: string;
    logo: string;
    color: string;
    textColor: string;
  };
  onBack: () => void;
  onClose: () => void;
}

type TransferType = 'send' | 'receive' | null;

export default function EMoneyTransfer({ operator, onBack, onClose }: EMoneyTransferProps) {
  const [transferType, setTransferType] = useState<TransferType>(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      type: transferType,
      amount: transferType === 'send' ? -numAmount : numAmount,
      recipient: transferType === 'send' ? operator.name : undefined,
      sender: transferType === 'receive' ? operator.name : undefined,
      date: new Date(),
      category: 'e-money',
      description: `${transferType === 'send' ? 'Envoi vers' : 'Réception depuis'} ${operator.name}`,
      details: {
        reference: `EM-${Date.now()}`,
        time: new Date().toLocaleTimeString('fr-FR'),
      }
    };

    // Update transactions in localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update balance (temporary solution for testing)
    const updateBalance = (window as any).updateBalance;
    if (updateBalance) {
      updateBalance((currentBalance: number) => currentBalance + (transferType === 'send' ? -numAmount : numAmount));
    }

    setShowSuccess(true);
    playSuccess();
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <CheckCircle2 className="h-24 w-24 text-green-500 relative animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {transferType === 'send' ? 'Transfert envoyé!' : 'Transfert reçu!'}
          </h2>
          <p className="text-gray-600">
            {amount} CFA {transferType === 'send' ? 'vers' : 'depuis'} {operator.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 rounded-xl overflow-hidden ${operator.color}`}>
            <img
              src={operator.logo}
              alt={operator.name}
              className="w-full h-full object-contain"
            />
          </div>
          <span className={`font-medium ${operator.textColor}`}>{operator.name}</span>
        </div>
      </div>

      {!transferType ? (
        <div className="space-y-4">
          <button
            onClick={() => setTransferType('send')}
            className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="p-3 rounded-xl bg-red-100">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Envoyer</p>
              <p className="text-sm text-gray-500">Transférer vers {operator.name}</p>
            </div>
          </button>

          <button
            onClick={() => setTransferType('receive')}
            className="w-full p-4 bg-white rounded-xl flex items-center space-x-4 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="p-3 rounded-xl bg-green-100">
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Recevoir</p>
              <p className="text-sm text-gray-500">Recevoir depuis {operator.name}</p>
            </div>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant à {transferType === 'send' ? 'envoyer' : 'recevoir'}
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="0"
                required
              />
              <span className="absolute right-4 top-3 text-gray-500">CFA</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors transform hover:scale-105 active:scale-95"
          >
            Confirmer
          </button>
        </form>
      )}
    </div>
  );
}