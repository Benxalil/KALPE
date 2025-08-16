import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface TransactionContextType {
  balance: number;
  transactions: Transaction[];
  processTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'balanceAfter' | 'details'>) => Promise<{
    success: boolean;
    transaction?: Transaction;
    newBalance: number;
    error?: string;
  }>;
  updateBalance: (newBalance: number) => void;
  getTransactionHistory: () => Transaction[];
  getBalanceHistory: () => { date: Date; balance: number }[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [balance, setBalance] = useState<number>(15000); // Solde initial
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const storedBalance = localStorage.getItem('userBalance');
    const storedTransactions = localStorage.getItem('userTransactions');

    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }

    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      setTransactions(parsedTransactions);
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('userBalance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('userTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const generateReference = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `KLP-${timestamp}-${random}`.toUpperCase();
  };

  const calculateFee = (amount: number, type: 'send' | 'receive'): number => {
    if (type === 'send') {
      return Math.round(amount * 0.01); // 1% de frais pour les envois
    }
    return 0; // Pas de frais pour les réceptions
  };

  const processTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'date' | 'balanceAfter' | 'details'>
  ): Promise<{
    success: boolean;
    transaction?: Transaction;
    newBalance: number;
    error?: string;
  }> => {
    try {
      const fee = calculateFee(Math.abs(transactionData.amount), transactionData.type);
      const totalAmount = transactionData.type === 'send' 
        ? Math.abs(transactionData.amount) + fee 
        : transactionData.amount;

      // Vérifier si le solde est suffisant pour les envois
      if (transactionData.type === 'send' && balance < totalAmount) {
        return {
          success: false,
          newBalance: balance,
          error: 'Solde insuffisant pour effectuer cette transaction'
        };
      }

      // Calculer le nouveau solde
      const newBalance = transactionData.type === 'send' 
        ? balance - totalAmount 
        : balance + totalAmount;

      // Créer la transaction
      const transaction: Transaction = {
        id: generateReference(),
        ...transactionData,
        amount: transactionData.type === 'send' ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount),
        date: new Date(),
        balanceAfter: newBalance,
        details: {
          reference: generateReference(),
          time: new Date().toLocaleTimeString('fr-FR'),
          fee: fee > 0 ? fee : undefined
        }
      };

      // Mettre à jour le state
      setBalance(newBalance);
      setTransactions(prev => [transaction, ...prev]);

      // Mettre à jour le solde global (pour compatibilité avec l'ancien système)
      const updateBalance = (window as any).updateBalance;
      if (updateBalance) {
        updateBalance(() => newBalance);
      }

      return {
        success: true,
        transaction,
        newBalance
      };

    } catch (error) {
      return {
        success: false,
        newBalance: balance,
        error: error instanceof Error ? error.message : 'Erreur lors du traitement de la transaction'
      };
    }
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  const getTransactionHistory = (): Transaction[] => {
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getBalanceHistory = (): { date: Date; balance: number }[] => {
    const history: { date: Date; balance: number }[] = [];
    let currentBalance = 15000; // Solde initial

    // Trier les transactions par date croissante
    const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

    sortedTransactions.forEach(transaction => {
      currentBalance = transaction.balanceAfter;
      history.push({
        date: transaction.date,
        balance: currentBalance
      });
    });

    return history;
  };

  const value: TransactionContextType = {
    balance,
    transactions,
    processTransaction,
    updateBalance,
    getTransactionHistory,
    getBalanceHistory
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}