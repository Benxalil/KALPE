import React, { useState } from 'react';
import { X, User, ArrowDownLeft, ArrowUpRight, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Client {
  id: string;
  name: string;
  phone: string;
  kalpe_id: string;
}

interface TransactionModalProps {
  client: Client;
  onClose: () => void;
  onComplete: () => void;
}

type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment';

export default function TransactionModal({ client, onClose, onComplete }: TransactionModalProps) {
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transactionTypes = [
    {
      type: 'deposit' as TransactionType,
      name: 'Dépôt',
      icon: ArrowDownLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Client dépose de l\'argent'
    },
    {
      type: 'withdrawal' as TransactionType,
      name: 'Retrait',
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Client retire de l\'argent'
    },
    {
      type: 'transfer' as TransactionType,
      name: 'Transfert',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Transfert vers un autre compte'
    },
    {
      type: 'payment' as TransactionType,
      name: 'Paiement',
      icon: Banknote,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Paiement de facture ou service'
    }
  ];

  const getCommissionRate = (type: TransactionType): number => {
    switch (type) {
      case 'deposit': return 0.01; // 1%
      case 'withdrawal': return 0.005; // 0.5%
      case 'transfer': return 0.003; // 0.3%
      case 'payment': return 0.002; // 0.2%
      default: return 0;
    }
  };

  const calculateCommission = (): number => {
    if (!selectedType || !amount) return 0;
    const rate = getCommissionRate(selectedType);
    return parseFloat(amount) * rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !amount) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const transactionAmount = parseFloat(amount);
      const commission = calculateCommission();

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('agent_transactions')
        .insert({
          agent_id: user.id,
          client_id: client.id,
          transaction_type: selectedType,
          amount: transactionAmount,
          commission: commission,
          status: 'completed',
          reference: `AGT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });

      if (transactionError) throw transactionError;

      // Update agent balance with commission
      const { error: balanceError } = await supabase.rpc('update_agent_balance', {
        agent_id: user.id,
        commission_amount: commission
      });

      if (balanceError) throw balanceError;

      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <CheckCircle2 className="h-24 w-24 text-green-500 relative animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction réussie!</h2>
          <p className="text-gray-600">
            {selectedType === 'deposit' ? 'Dépôt' : 
             selectedType === 'withdrawal' ? 'Retrait' :
             selectedType === 'transfer' ? 'Transfert' : 'Paiement'} de {amount} CFA
          </p>
          <p className="text-sm text-green-600">
            Commission: {calculateCommission().toFixed(0)} CFA
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Nouvelle Transaction</h2>
          
          {/* Client Info */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-indigo-100 rounded-full">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
              <p className="text-xs text-gray-400">ID: {client.kalpe_id}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!selectedType ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Type de transaction</h3>
            {transactionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className="w-full p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${type.bgColor}`}>
                      <Icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {transactionTypes.find(t => t.type === selectedType)?.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="text-indigo-600 text-sm hover:text-indigo-700"
              >
                Changer
              </button>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant
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
                  required
                />
                <span className="absolute right-4 top-3 text-gray-500">CFA</span>
              </div>
            </div>

            {amount && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium">{parseFloat(amount).toLocaleString('fr-FR')} CFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Commission ({(getCommissionRate(selectedType) * 100).toFixed(1)}%)</span>
                  <span className="font-medium text-green-600">+{calculateCommission().toFixed(0)} CFA</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!amount || isProcessing}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Traitement...' : 'Confirmer la transaction'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}