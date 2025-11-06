import React, { useState, useEffect } from 'react';
import { QrCode, ArrowDownLeft, ArrowUpRight, History, DollarSign, Camera, User, CircleCheck as CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import QRScanner from './QRScanner';
import TransactionModal from './TransactionModal';
import AgentTransactionHistory from './AgentTransactionHistory';

interface AgentStats {
  balance: number;
  todayTransactions: number;
  totalCommissions: number;
  pendingTransactions: number;
}

interface ScannedClient {
  id: string;
  name: string;
  phone: string;
  kalpe_id: string;
}

interface AgentDashboardProps {
  onNavigateBack?: () => void;
}

export default function AgentDashboard({ onNavigateBack }: AgentDashboardProps) {
  const [stats, setStats] = useState<AgentStats>({
    balance: 0,
    todayTransactions: 0,
    totalCommissions: 0,
    pendingTransactions: 0
  });
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scannedClient, setScannedClient] = useState<ScannedClient | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  useEffect(() => {
    fetchAgentStats();
  }, []);

  const fetchAgentStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Fetch agent balance and stats
      const { data: agentData, error: agentError } = await supabase
        .from('agent_balances')
        .select('balance, total_commissions')
        .eq('agent_id', user.id)
        .single();

      if (agentError && agentError.code !== 'PGRST116') {
        throw agentError;
      }

      // Fetch today's transactions count
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('agent_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', user.id)
        .gte('created_at', today);

      // Fetch pending transactions count
      const { count: pendingCount } = await supabase
        .from('agent_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', user.id)
        .eq('status', 'pending');

      setStats({
        balance: agentData?.balance || 0,
        todayTransactions: todayCount || 0,
        totalCommissions: agentData?.total_commissions || 0,
        pendingTransactions: pendingCount || 0
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (qrData: string) => {
    try {
      // Parse QR code data (assuming format: kalpe://user/{user_id})
      const clientId = qrData.replace('kalpe://user/', '');
      
      // Fetch client details
      fetchClientDetails(clientId);
      setShowScanner(false);
    } catch (err) {
      setError('QR Code invalide');
    }
  };

  const fetchClientDetails = async (clientId: string) => {
    try {
      const { data: clientData, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, kalpe_id')
        .eq('id', clientId)
        .single();

      if (error) throw error;

      setScannedClient({
        id: clientData.id,
        name: clientData.full_name,
        phone: clientData.phone,
        kalpe_id: clientData.kalpe_id
      });
      setShowTransactionModal(true);
    } catch (err) {
      setError('Client introuvable');
    }
  };

  const handleTransactionComplete = () => {
    setShowTransactionModal(false);
    setScannedClient(null);
    fetchAgentStats(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (showHistory) {
    return <AgentTransactionHistory onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        {onNavigateBack && (
          <div className="mb-6">
            <button
              onClick={handleClose}
              className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l'accueil
            </button>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Agent Balance Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-2">Solde Agent</p>
              <p className="text-3xl font-bold">{stats.balance.toLocaleString('fr-FR')} CFA</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.todayTransactions}</p>
              <p className="text-xs opacity-75">Aujourd'hui</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalCommissions.toLocaleString('fr-FR')}</p>
              <p className="text-xs opacity-75">Commissions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
              <p className="text-xs opacity-75">En attente</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center space-y-4 hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-xl bg-indigo-100">
              <Camera className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="font-medium">Scanner QR</span>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center space-y-4 hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-xl bg-green-100">
              <History className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium">Historique</span>
          </button>
        </div>

        {/* Commission Rates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Taux de Commission</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Dépôt</span>
              <span className="font-medium">1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retrait</span>
              <span className="font-medium">0.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transfert</span>
              <span className="font-medium">0.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paiement</span>
              <span className="font-medium">0.2%</span>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Transaction Modal */}
        {showTransactionModal && scannedClient && (
          <TransactionModal
            client={scannedClient}
            onClose={() => setShowTransactionModal(false)}
            onComplete={handleTransactionComplete}
          />
        )}
      </div>
    </div>
  );
}