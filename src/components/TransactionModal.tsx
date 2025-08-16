import React, { useState, useEffect } from 'react';
import { X, Landmark, Receipt, UtensilsCrossed, PiggyBank, ArrowUpRight, ArrowDownLeft, Bus, Timer } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

type TransactionModalProps = {
  transaction: {
    id: number;
    type: 'send' | 'receive' | 'ticket';
    amount: number;
    recipient?: string;
    sender?: string;
    date: Date;
    category: string;
    description: string;
    details: {
      reference: string;
      bankName?: string;
      companyName?: string;
      restaurantName?: string;
      address?: string;
      time: string;
      ticketData?: {
        transport: string;
        from: string;
        to: string;
        qrCode: string;
        expiresAt: Date;
      };
    };
  };
  onClose: () => void;
};

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

export default function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const Icon = getCategoryIcon(transaction.category);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (transaction.details.ticketData) {
      const updateTimer = () => {
        const now = new Date();
        const expiresAt = new Date(transaction.details.ticketData!.expiresAt);
        
        if (isAfter(now, expiresAt)) {
          setIsExpired(true);
          setTimeLeft('Expiré');
          return;
        }

        const diff = expiresAt.getTime() - now.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [transaction.details.ticketData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-full ${
              transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {transaction.type === 'receive' ? (
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              ) : (
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold">
                {Math.abs(transaction.amount).toLocaleString('fr-FR')} CFA
              </h3>
              <p className="text-gray-500">
                {format(transaction.date, 'dd MMMM yyyy', { locale: fr })} à {transaction.details.time}
              </p>
            </div>
          </div>

          {transaction.details.ticketData && (
            <div className="mb-6 space-y-4">
              <div className="flex justify-center">
                <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-xs">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{transaction.details.ticketData.transport}</h4>
                      <p className="text-sm text-gray-500">Ticket de transport</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <Timer className="h-4 w-4 mr-1" />
                      <span className={isExpired ? 'text-red-600' : 'text-gray-600'}>
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      value={transaction.details.ticketData.qrCode}
                      size={200}
                      level="H"
                      className={isExpired ? 'opacity-50' : ''}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">De</span>
                      <span className="font-medium">{transaction.details.ticketData.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">À</span>
                      <span className="font-medium">{transaction.details.ticketData.to}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpired && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
                  Ce ticket a expiré et ne peut plus être utilisé
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Type</span>
              <div className="flex items-center">
                <Icon className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-medium capitalize">{transaction.category}</span>
              </div>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Référence</span>
              <span className="font-medium">{transaction.details.reference}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Description</span>
              <span className="font-medium">{transaction.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}