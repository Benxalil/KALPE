import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Landmark, Receipt, UtensilsCrossed, PiggyBank, ArrowUpRight, ArrowDownLeft, Bus } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { useTransaction } from '../contexts/TransactionContext';
import { transactions as initialTransactions } from '../data/transactions';
import { Transaction } from '../types/transaction';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'banque':
      return Landmark;
    case 'facture':
      return Receipt;
    case 'resto':
      return UtensilsCrossed;
    case 'transport':
      return Bus;
    default:
      return PiggyBank;
  }
};

export default function TransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { getTransactionHistory } = useTransaction();
  
  // Combine new transactions with initial ones
  const userTransactions = getTransactionHistory();
  const allTransactions = [
    ...userTransactions.map(t => ({
      ...t,
      id: parseInt(t.id.replace(/\D/g, '')) || Date.now(),
      recipient: t.type === 'send' ? t.recipient : undefined,
      sender: t.type === 'receive' ? t.sender : undefined,
      details: {
        reference: t.details.reference,
        time: t.details.time,
      }
    })),
    ...initialTransactions
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Historique des transactions</h2>
      <div className="space-y-4">
        {allTransactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          return (
            <button
              key={transaction.id}
              className="w-full bg-white rounded-lg shadow-sm p-3 flex items-center hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className={`p-2 rounded-full mr-2 ${
                transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'receive' ? (
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="font-medium leading-tight">
                      {transaction.type === 'receive' ? transaction.sender : transaction.recipient}
                    </p>
                    <p className="text-sm text-gray-500 leading-tight mt-0.5">{transaction.description}</p>
                  </div>
                  <p className={`font-semibold ml-2 whitespace-nowrap ${
                    transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(transaction.amount).toLocaleString('fr-FR')} CFA
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon className="h-4 w-4 mr-1" />
                    <span className="capitalize">{transaction.category}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}