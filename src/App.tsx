import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QRCodeSection from './components/QRCodeSection';
import QuickActions from './components/QuickActions';
import TransactionHistory from './components/TransactionHistory';
import ContactList from './components/contacts/ContactList';
import CreditRecharge from './components/credit/CreditRecharge';
import BillPayment from './components/bills/BillPayment';
import PaymentSection from './components/payments/PaymentSection';
import MoneyPotList from './components/moneypot/MoneyPotList';
import BankList from './components/banks/BankList';
import RewardsList from './components/rewards/RewardsList';
import TontineList from './components/tontine/TontineList';
import TransportList from './components/transport/TransportList';
import EMoneyList from './components/emoney/EMoneyList';
import CardManager from './components/card/CardManager';
import VaultManager from './components/vault/VaultManager';
import StatisticsSection from './components/stats/StatisticsSection';
import AgentDashboard from './components/agent/AgentDashboard';
import { TransactionProvider } from './contexts/TransactionContext';

type PageType = 'home' | 'transfert' | 'credit' | 'facture' | 'paiement' | 'banque' | 'emoney' | 'carte' | 'transport' | 'cagnotte' | 'cadeaux' | 'tontine' | 'coffre' | 'statistiques' | 'agent';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [navigationHistory, setNavigationHistory] = useState<PageType[]>(['home']);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    setNavigationHistory(prev => [...prev, page]);
    // Update URL without page reload
    window.history.pushState({ page }, '', `/${page === 'home' ? '' : page}`);
  };

  const navigateBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);
      window.history.pushState({ page: previousPage }, '', `/${previousPage === 'home' ? '' : previousPage}`);
    } else {
      // Fallback to home if no history
      setCurrentPage('home');
      setNavigationHistory(['home']);
      window.history.pushState({ page: 'home' }, '', '/');
    }
  };

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || 'home';
      setCurrentPage(page);
      // Update navigation history when using browser buttons
      if (page === 'home') {
        setNavigationHistory(['home']);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state
    const path = window.location.pathname.slice(1) || 'home';
    if (path !== 'home') {
      setCurrentPage(path as PageType);
      setNavigationHistory(['home', path as PageType]);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'transfert':
        return <ContactList onNavigateBack={navigateBack} />;
      case 'credit':
        return <CreditRecharge onNavigateBack={navigateBack} />;
      case 'facture':
        return <BillPayment onNavigateBack={navigateBack} />;
      case 'paiement':
        return <PaymentSection onNavigateBack={navigateBack} />;
      case 'banque':
        return <BankList onNavigateBack={navigateBack} />;
      case 'emoney':
        return <EMoneyList onNavigateBack={navigateBack} />;
      case 'carte':
        return <CardManager onNavigateBack={navigateBack} />;
      case 'transport':
        return <TransportList onNavigateBack={navigateBack} />;
      case 'cagnotte':
        return <MoneyPotList onNavigateBack={navigateBack} />;
      case 'cadeaux':
        return <RewardsList onNavigateBack={navigateBack} />;
      case 'tontine':
        return <TontineList onNavigateBack={navigateBack} />;
      case 'coffre':
        return <VaultManager onNavigateBack={navigateBack} />;
      case 'statistiques':
        return <StatisticsSection onNavigateBack={navigateBack} />;
      case 'agent':
        return <AgentDashboard onNavigateBack={navigateBack} />;
      default:
        return (
          <div className="pt-16">
            <Hero />
            <QRCodeSection />
            <QuickActions onNavigate={navigateToPage} />
            <TransactionHistory />
          </div>
        );
    }
  };

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onNavigateHome={() => {
          setCurrentPage('home');
          setNavigationHistory(['home']);
          window.history.pushState({ page: 'home' }, '', '/');
        }} />
        {renderPage()}
      </div>
    </TransactionProvider>
  );
}

export default App;