import React from 'react';
import { AlertTriangle, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface TransferAmountProps {
  amount: string;
  setAmount: (amount: string) => void;
  receiveAmount: string;
  setReceiveAmount: (amount: string) => void;
  availableBalance: number;
  isExceedingBalance: boolean;
  activeField: 'send' | 'receive';
  setActiveField: (field: 'send' | 'receive') => void;
}

// Calculate fees: 1 F CFA per 100 F CFA sent
const calculateFees = (amount: number): number => {
  return Math.ceil(amount / 100);
};

// Calculate send amount from receive amount
const calculateSendAmount = (receiveAmount: number): number => {
  // We need to find the send amount such that: sendAmount - fees(sendAmount) = receiveAmount
  // Since fees = ceil(sendAmount / 100), we can approximate and then adjust
  let sendAmount = receiveAmount;
  let fees = calculateFees(sendAmount);
  
  // Iterate to find the exact amount
  while (sendAmount - fees < receiveAmount) {
    sendAmount++;
    fees = calculateFees(sendAmount);
  }
  
  return sendAmount;
};

// Calculate receive amount from send amount
const calculateReceiveAmount = (sendAmount: number): number => {
  const fees = calculateFees(sendAmount);
  return Math.max(0, sendAmount - fees);
};

export default function TransferAmount({ 
  amount, 
  setAmount, 
  receiveAmount,
  setReceiveAmount,
  availableBalance,
  isExceedingBalance,
  activeField,
  setActiveField
}: TransferAmountProps) {
  
  const handleSendAmountChange = (value: string) => {
    setActiveField('send');
    setAmount(value);
    
    if (value && !isNaN(Number(value))) {
      const sendAmount = Number(value);
      const calculatedReceiveAmount = calculateReceiveAmount(sendAmount);
      setReceiveAmount(calculatedReceiveAmount.toString());
    } else {
      setReceiveAmount('');
    }
  };

  const handleReceiveAmountChange = (value: string) => {
    setActiveField('receive');
    setReceiveAmount(value);
    
    if (value && !isNaN(Number(value))) {
      const targetReceiveAmount = Number(value);
      const calculatedSendAmount = calculateSendAmount(targetReceiveAmount);
      setAmount(calculatedSendAmount.toString());
    } else {
      setAmount('');
    }
  };

  const sendAmount = Number(amount) || 0;
  const fees = sendAmount > 0 ? calculateFees(sendAmount) : 0;
  const finalReceiveAmount = Number(receiveAmount) || 0;

  return (
    <div className="space-y-4">
      {/* Send Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Montant à envoyer
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => handleSendAmountChange(e.target.value)}
            className={`block w-full px-4 py-3 rounded-xl border ${
              isExceedingBalance 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : activeField === 'send'
                ? 'border-indigo-300 focus:border-indigo-500 focus:ring-indigo-200'
                : 'border-gray-200 focus:border-indigo-300 focus:ring-indigo-200'
            } focus:ring focus:ring-opacity-50 transition-all duration-200`}
            placeholder="0"
            min="0"
          />
          <span className="absolute right-4 top-3 text-gray-500">CFA</span>
        </div>
      </div>

      {/* Receive Amount Field */}
      <div>
        <label htmlFor="receiveAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Montant à recevoir
        </label>
        <div className="relative">
          <input
            type="number"
            id="receiveAmount"
            value={receiveAmount}
            onChange={(e) => handleReceiveAmountChange(e.target.value)}
            className={`block w-full px-4 py-3 rounded-xl border ${
              activeField === 'receive'
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-200 focus:border-indigo-300 focus:ring-indigo-200'
            } focus:ring focus:ring-opacity-50 transition-all duration-200`}
            placeholder="0"
            min="0"
          />
          <span className="absolute right-4 top-3 text-gray-500">CFA</span>
        </div>
      </div>

      {/* Calculation Summary */}
      {sendAmount > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Calculator className="h-4 w-4" />
            <span>Détail du calcul</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant à envoyer</span>
            <span className="font-medium">{formatCurrency(sendAmount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frais (1 F par 100 F)</span>
            <span className="font-medium text-orange-600">-{formatCurrency(fees)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-900">Montant reçu</span>
              <span className="text-green-600">{formatCurrency(finalReceiveAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Balance and Error Messages */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Solde disponible : {formatCurrency(availableBalance)}
        </span>
        {isExceedingBalance && (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Montant trop élevé</span>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 <strong>Astuce :</strong> Vous pouvez saisir soit le montant à envoyer, soit le montant que le destinataire doit recevoir. L'autre champ se calculera automatiquement.
        </p>
      </div>
    </div>
  );
}