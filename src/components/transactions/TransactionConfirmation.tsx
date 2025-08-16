import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowUpRight, ArrowDownLeft, Clock, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useSound from 'use-sound';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  recipient?: string;
  sender?: string;
  date: Date;
  category: string;
  description: string;
  balanceAfter: number;
  details: {
    reference: string;
    time: string;
    fee?: number;
  };
}

interface TransactionConfirmationProps {
  transaction: Transaction;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function TransactionConfirmation({ 
  transaction, 
  onClose, 
  autoClose = true, 
  autoCloseDelay = 3000 
}: TransactionConfirmationProps) {
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');
  const [countdown, setCountdown] = useState(autoCloseDelay / 1000);

  useEffect(() => {
    playSuccess();
  }, [playSuccess]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const isReceive = transaction.type === 'receive';
  const displayAmount = Math.abs(transaction.amount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
        {/* Success Animation */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <CheckCircle2 className="h-20 w-20 text-green-500 relative animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {isReceive ? 'Argent reçu!' : 'Transfert réussi!'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isReceive ? 'Vous avez reçu' : 'Vous avez envoyé'} {formatCurrency(displayAmount)}
            {!isReceive && transaction.recipient && ` à ${transaction.recipient}`}
            {isReceive && transaction.sender && ` de ${transaction.sender}`}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              {isReceive ? (
                <ArrowDownLeft className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <ArrowUpRight className="h-4 w-4 mr-2 text-red-600" />
              )}
              Montant
            </span>
            <span className={`font-bold ${isReceive ? 'text-green-600' : 'text-red-600'}`}>
              {isReceive ? '+' : '-'}{formatCurrency(displayAmount)}
            </span>
          </div>

          {transaction.details.fee && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Frais</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(transaction.details.fee)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Nouveau solde</span>
            <span className="font-bold text-indigo-600">
              {formatCurrency(transaction.balanceAfter)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Heure
            </span>
            <span className="font-medium">
              {format(transaction.date, 'dd MMMM yyyy', { locale: fr })} à {transaction.details.time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Receipt className="h-4 w-4 mr-2" />
              Référence
            </span>
            <span className="font-mono text-sm bg-white px-2 py-1 rounded">
              {transaction.details.reference}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Continuer
          </button>

          {autoClose && countdown > 0 && (
            <p className="text-center text-sm text-gray-500">
              Fermeture automatique dans {countdown}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}