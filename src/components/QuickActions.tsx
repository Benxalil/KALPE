import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, FileText, Smartphone, CreditCard, Building2, Bus, PiggyBank, Gift, Users, Wallet, Lock, BarChart3, UserCheck } from 'lucide-react';
import ContactList from './contacts/ContactList';
import CreditRecharge from './credit/CreditRecharge';
import BillPayment from './bills/BillPayment';
import PaymentSection from './payments/PaymentSection';
import MoneyPotList from './moneypot/MoneyPotList';
import BankList from './banks/BankList';
import RewardsList from './rewards/RewardsList';
import TontineList from './tontine/TontineList';
import TransportList from './transport/TransportList';
import EMoneyList from './emoney/EMoneyList';
import CardManager from './card/CardManager';
import VaultManager from './vault/VaultManager';
import StatisticsSection from './stats/StatisticsSection';
import AgentDashboard from './agent/AgentDashboard';
import { supabase } from '../lib/supabaseClient';

const actions = [
  { name: 'Transfert', icon: ArrowLeftRight },
  { name: 'Crédit', icon: Smartphone },
  { name: 'Facture', icon: FileText },
  { name: 'Paiement', icon: CreditCard },
  { name: 'Banque', icon: Building2 },
  { name: 'E-Money', icon: Wallet },
  { name: 'Carte', icon: CreditCard },
  { name: 'Transport', icon: Bus },
  { name: 'Cagnotte', icon: PiggyBank },
  { name: 'Cadeaux', icon: Gift },
  { name: 'Tontine', icon: Users },
  { name: 'Coffre', icon: Lock },
  { name: 'Agent', icon: UserCheck },
  { name: 'Agent', icon: UserCheck },
];

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const [showContacts, setShowContacts] = useState(false);
  const [showCreditRecharge, setShowCreditRecharge] = useState(false);
  const [showBillPayment, setShowBillPayment] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [showMoneyPot, setShowMoneyPot] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showTontine, setShowTontine] = useState(false);
  const [showTransport, setShowTransport] = useState(false);
  const [showEMoney, setShowEMoney] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [hasValidatedAgentRequest, setHasValidatedAgentRequest] = useState(false);

  // Check if user is an agent
  useEffect(() => {
    checkAgentStatus();
  }, []);

  const checkAgentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('agent_kalpe')
        .eq('id', user.id)
        .single();

      setIsAgent(profile?.agent_kalpe || false);
      
      // Check if user has a validated agent request
      if (profile?.agent_kalpe) {
        const { data: agentRequest } = await supabase
          .from('agent_requests')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .single();
        
        setHasValidatedAgentRequest(!!agentRequest);
      }
    } catch (error) {
      console.error('Error checking agent status:', error);
    }
  };

  // Écouter l'événement pour fermer tous les modals
  useEffect(() => {
    const handleCloseAllModals = () => {
      setShowContacts(false);
      setShowCreditRecharge(false);
      setShowBillPayment(false);
      setShowPaymentSection(false);
      setShowMoneyPot(false);
      setShowBankList(false);
      setShowRewards(false);
      setShowTontine(false);
      setShowTransport(false);
      setShowEMoney(false);
      setShowCard(false);
      setShowVault(false);
      setShowAgent(false);
    };

    window.addEventListener('closeAllModals', handleCloseAllModals);
    return () => window.removeEventListener('closeAllModals', handleCloseAllModals);
  }, []);

  const handleActionClick = (actionName: string) => {
    // Check if user is trying to access Agent section
    if (actionName === 'Agent' && (!isAgent || !hasValidatedAgentRequest)) {
      alert('Vous devez être un agent Kalpé validé pour accéder à cette section. Faites une demande dans les paramètres.');
      return;
    }

    // Navigate to the corresponding page
    const pageMap: { [key: string]: string } = {
      'Transfert': 'transfert',
      'Crédit': 'credit',
      'Facture': 'facture',
      'Paiement': 'paiement',
      'Banque': 'banque',
      'E-Money': 'emoney',
      'Carte': 'carte',
      'Transport': 'transport',
      'Cagnotte': 'cagnotte',
      'Cadeaux': 'cadeaux',
      'Tontine': 'tontine',
      'Coffre': 'coffre',
      'Statistiques': 'statistiques',
      'Agent': 'agent'
    };

    const page = pageMap[actionName];
    if (page) {
      onNavigate(page);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-6 px-6 py-4">
        {actions.filter(action => {
          // Hide Agent section if user is not a validated agent
          if (action.name === 'Agent') {
            return isAgent && hasValidatedAgentRequest;
          }
          return true;
        }).map((action) => {
          const Icon = action.icon;
          const isAgentAction = action.name === 'Agent';
          const isAccessible = !isAgentAction || (isAgent && hasValidatedAgentRequest);
          
          return (
            <button
              key={action.name}
              className={`flex flex-col items-center space-y-2 ${
                !isAccessible ? 'opacity-50' : ''
              }`}
              onClick={() => handleActionClick(action.name)}
            >
              <div className={`p-3 rounded-xl bg-white shadow-sm ${
                isAgentAction && isAgent && hasValidatedAgentRequest ? 'ring-2 ring-green-500' : ''
              }`}>
                <Icon className={`h-6 w-6 ${
                  isAgentAction && isAgent && hasValidatedAgentRequest ? 'text-green-600' : 'text-indigo-600'
                }`} />
              </div>
              <span className="text-sm text-gray-600">{action.name}</span>
              {isAgentAction && isAgent && hasValidatedAgentRequest && (
                <span className="text-xs text-green-600 font-medium">Actif</span>
              )}
            </button>
          );
        })}
      </div>

    </>
  );
}