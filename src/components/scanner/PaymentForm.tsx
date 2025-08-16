import React, { useState } from 'react';
import { X, User } from 'lucide-react';

interface PaymentFormProps {
  recipientId: string;
  onClose: () => void;
}

interface Recipient {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

// Mock recipient data - in real app, this would come from an API
const mockRecipient: Recipient = {
  id: 'recipient-123',
  name: 'Marie Diop',
  phone: '+221 77 123 45 67',
};

export default function PaymentForm({ recipientId, onClose }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const recipient = mockRecipient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    console.log('Payment:', { recipientId, amount });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Paiement</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-4">
              {recipient.avatar ? (
                <img
                  src={recipient.avatar}
                  alt={recipient.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
              )}
              <div>
                <h2 className="font-semibold">{recipient.name}</h2>
                <p className="text-sm text-gray-500">{recipient.phone}</p>
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
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="0"
                required
              />
              <span className="absolute right-4 top-3 text-gray-500">CFA</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}