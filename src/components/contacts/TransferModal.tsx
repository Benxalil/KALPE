import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock, Gift, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { format, startOfMonth, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import TransferAmount from './TransferAmount';
import TransactionConfirmation from '../transactions/TransactionConfirmation';
import { useTransaction } from '../../contexts/TransactionContext';

interface TransferModalProps {
  contact: {
    name: string;
    phone: string;
  };
  onClose: () => void;
  onBackToHome?: () => void;
}

interface TransferHistory {
  id: number;
  amount: number;
  date: Date;
  type: 'send' | 'receive';
}

export default function TransferModal({ contact, onClose, onBackToHome }: TransferModalProps) {
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [activeField, setActiveField] = useState<'send' | 'receive'>('send');
  const [finalAmount, setFinalAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [isFreeTransfer, setIsFreeTransfer] = useState(false);
  const [freeTransferReason, setFreeTransferReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  
  const { balance, processTransaction } = useTransaction();
  
  // Calculate fees: 1 F CFA per 100 F CFA sent
  const calculateFees = (amount: number): number => {
    return Math.ceil(amount / 100);
  };

  useEffect(() => {
    // Load transfer history from localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const history = transactions
      .filter((t: any) => 
        (t.recipient === contact.name) || 
        (t.sender === contact.name)
      )
      .map((t: any) => ({
        id: t.id,
        amount: Math.abs(t.amount),
        date: new Date(t.date),
        type: t.type
      }));
    setTransferHistory(history);

    // Check for free transfer conditions
    const now = new Date();
    const monthStart = startOfMonth(now);
    const weekStart = subDays(now, 7);

    // Check if it's first transfer of the month
    const monthTransfers = history.filter(t => t.date >= monthStart);
    if (monthTransfers.length === 0) {
      setIsFreeTransfer(true);
      setFreeTransferReason('Premier transfert du mois gratuit !');
      return;
    }

    // Check for 6th transfer in last 7 days
    const weekTransfers = history.filter(t => t.date >= weekStart);
    if (weekTransfers.length === 5) {
      setIsFreeTransfer(true);
      setFreeTransferReason('6ème transfert gratuit !');
    }
  }, [contact.name]);

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const fee = isFreeTransfer ? 0 : calculateFees(numAmount);
    setFinalAmount(numAmount - fee);
  }, [amount, isFreeTransfer, calculateFees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid || isProcessing) return;

    setIsProcessing(true);

    try {
      const result = await processTransaction({
        type: 'send',
        amount: parseFloat(amount),
        recipient: contact.name,
        category: 'transfer',
        description: `Transfert vers ${contact.name}`
      });

      if (result.success && result.transaction) {
        setCompletedTransaction(result.transaction);
      } else {
        alert(result.error || 'Erreur lors du transfert');
      }
    } catch (error) {
      alert('Erreur lors du transfert');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      onClose();
    }
  };

  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= balance;
  const isAmountExceedingBalance = parseFloat(amount) > balance;

  // Show transaction confirmation
  if (completedTransaction) {
    return (
      <TransactionConfirmation
        transaction={completedTransaction}
        onClose={handleBackToHome}
        autoClose={true}
        autoCloseDelay={4000}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        {/* Header avec flèche de retour et bouton fermer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={handleBackToHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">Transfert</h2>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">Envoyer à {contact.name}</h3>
            <p className="text-sm text-gray-500">{contact.phone}</p>
          </div>

          {isFreeTransfer && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              <span>{freeTransferReason}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TransferAmount
              amount={amount}
              setAmount={setAmount}
              receiveAmount={receiveAmount}
              setReceiveAmount={setReceiveAmount}
              availableBalance={balance}
              isExceedingBalance={isAmountExceedingBalance}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Frais ({isFreeTransfer ? '0' : '1 F par 100 F'})</span>
                <span>{amount ? `${isFreeTransfer ? '0' : calculateFees(parseFloat(amount)).toLocaleString('fr-FR')} CFA` : '-'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Montant reçu</span>
                <span className="text-green-600">{finalAmount.toLocaleString('fr-FR')} CFA</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isAmountValid || isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer le transfert'}
            </button>
          </form>

          {transferHistory.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                {showHistory ? 'Masquer l\'historique' : 'Voir l\'historique'}
              </button>

              {showHistory && (
                <div className="mt-4 space-y-3">
                  {transferHistory.map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className={`font-medium ${
                          transfer.type === 'receive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transfer.type === 'receive' ? '+' : '-'}
                          {formatCurrency(transfer.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(transfer.date, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(transfer.date, 'HH:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}