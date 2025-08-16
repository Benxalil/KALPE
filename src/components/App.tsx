import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QRCodeSection from './components/QRCodeSection';
import QuickActions from './components/QuickActions';
import TransactionHistory from './components/TransactionHistory';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <Hero />
        <QRCodeSection />
        <QuickActions />
        <TransactionHistory />
      </div>
    </div>
  );
}

export default App;