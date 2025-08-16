import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ArrowDownLeft, ArrowUpRight, CreditCard, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabaseClient';

interface AgentTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  commission: number;
  client_name: string;
  client_phone: string;
  status: string;
  reference: string;
  created_at: string;
}

interface AgentTransactionHistoryProps {
  onBack: () => void;
}

export default function AgentTransactionHistory({ onBack }: AgentTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<AgentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterType]);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      let query = supabase
        .from('agent_transactions')
        .select(`
          id,
          transaction_type,
          amount,
          commission,
          status,
          reference,
          created_at,
          profiles!client_id (
            full_name,
            phone
          )
        `)
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (filterType !== 'all') {
        query = query.eq('transaction_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedTransactions = data.map(transaction => ({
        id: transaction.id,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        commission: transaction.commission,
        client_name: transaction.profiles?.full_name || 'Client inconnu',
        client_phone: transaction.profiles?.phone || '',
        status: transaction.status,
        reference: transaction.reference,
        created_at: transaction.created_at
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-100' };
      case 'withdrawal':
        return { icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-100' };
      case 'transfer':
        return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'payment':
        return { icon: Banknote, color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { icon: CreditCard, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'transfer': return 'Transfert';
      case 'payment': return 'Paiement';
      default: return type;
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-2xl font-bold">Historique des Transactions</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par client ou référence..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="all">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
              <option value="transfer">Transferts</option>
              <option value="payment">Paiements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const { icon: Icon, color, bg } = getTransactionIcon(transaction.transaction_type);
            
            return (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${bg}`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{transaction.client_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Terminé' : 
                           transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{transaction.client_phone}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(transaction.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-lg font-semibold">
                        {transaction.amount.toLocaleString('fr-FR')} CFA
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        +{transaction.commission.toFixed(0)} CFA
                      </span>
                      <span className="text-xs text-gray-500">
                        {getTransactionLabel(transaction.transaction_type)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Référence</span>
                    <span className="font-mono text-gray-900">{transaction.reference}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredTransactions.length === itemsPerPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Charger plus
          </button>
        </div>
      )}
    </div>
  );
}