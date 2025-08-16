import React, { useState } from 'react';
import { X, AlertCircle, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Contact } from '../../types/contact';
import { formatCurrency } from '../../utils/currency';
import TransactionConfirmation from '../transactions/TransactionConfirmation';
import { useTransaction } from '../../contexts/TransactionContext';

interface NonKalpeTransferProps {
  contact: Contact;
  onClose: () => void;
}

export default function NonKalpeTransfer({ contact, onClose }: NonKalpeTransferProps) {
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  
  const { processTransaction } = useTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const generateSMSContent = () => {
    return `Vous avez reçu ${formatCurrency(Number(amount))} de John Doe via Kalpé! 🎉

Pour retirer votre argent, téléchargez l'application Kalpé ici : https://kalpe.app/download

Votre argent est sécurisé et sera disponible dès la création de votre compte.`;
  };

  const handleConfirmTransfer = async () => {
    setIsProcessing(true);

    try {
      const result = await processTransaction({
        type: 'send',
        amount: Number(amount),
        recipient: contact.name,
        category: 'transfer',
        description: 'Transfert hors Kalpé'
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

  // Show transaction confirmation
  if (completedTransaction) {
    return (
      <TransactionConfirmation
        transaction={completedTransaction}
        onClose={onClose}
        autoClose={true}
        autoCloseDelay={4000}
      />
    );
  }

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowConfirmation(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </button>
            <h1 className="text-2xl font-bold">Confirmation</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h2 className="font-semibold mb-2">SMS qui sera envoyé :</h2>
              <p className="text-sm whitespace-pre-line">{generateSMSContent()}</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Les fonds seront bloqués jusqu'à la création du compte</li>
                  <li>Le destinataire recevra un SMS avec les instructions</li>
                  <li>Vous serez notifié lorsque le compte sera créé</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleConfirmTransfer}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer le transfert'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-2xl font-bold">Transfert hors Kalpé</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold">{contact.name}</h2>
                <p className="text-sm text-gray-500">{contact.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Montant
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="0"
                required
              />
              <span className="absolute right-4 top-3 text-gray-500">CFA</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}