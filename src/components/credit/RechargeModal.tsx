import React, { useState } from 'react';
import { X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Contact } from '../../types/contact';
import { getOperatorInfo } from '../../utils/operator';
import { formatCurrency } from '../../utils/currency';

interface RechargeModalProps {
  contact: Contact;
  onClose: () => void;
}

export default function RechargeModal({ contact, onClose }: RechargeModalProps) {
  const [amount, setAmount] = useState('');
  const operator = getOperatorInfo(contact.phone);
  
  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 5000;
  
  const numAmount = parseFloat(amount);
  const isAmountValid = numAmount >= MIN_AMOUNT && numAmount <= MAX_AMOUNT;
  const isAmountTooHigh = numAmount > MAX_AMOUNT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) return;

    console.log('Recharge:', {
      contact,
      amount: numAmount,
      operator: operator?.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">Recharge crédit</h2>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {operator && (
              <img 
                src={operator.logo} 
                alt={operator.name}
                className="h-12 w-12 object-contain"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{contact.name}</h2>
              <p className="text-sm text-gray-500">{contact.phone}</p>
              {operator && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                  operator.bgColor
                }`}>
                  {operator.name}
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Montant de la recharge
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`block w-full px-4 py-3 rounded-xl border ${
                    isAmountTooHigh 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-300 focus:ring-indigo-200'
                  } focus:ring focus:ring-opacity-50`}
                  placeholder={`${MIN_AMOUNT} - ${MAX_AMOUNT}`}
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  required
                />
                <span className="absolute right-4 top-3 text-gray-500">CFA</span>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Montant autorisé : {formatCurrency(MIN_AMOUNT)} - {formatCurrency(MAX_AMOUNT)}
                </span>
                {isAmountTooHigh && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Montant trop élevé</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isAmountValid}
            >
              Confirmer la recharge
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}