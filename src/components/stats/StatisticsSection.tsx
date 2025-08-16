import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatisticsSectionProps {
  onNavigateBack?: () => void;
}

interface MonthlyStats {
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  fees: number;
}

interface ContactStats {
  name: string;
  sent: number;
  received: number;
  transactionCount: number;
}

export default function StatisticsSection({ onNavigateBack }: StatisticsSectionProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [view, setView] = useState<'overview' | 'contacts'>('overview');
  const [selectedContact, setSelectedContact] = useState<string>('all');
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalSent: 0,
    totalReceived: 0,
    transactionCount: 0,
    fees: 0
  });
  const [contactStats, setContactStats] = useState<ContactStats[]>([]);
  const [availableContacts, setAvailableContacts] = useState<string[]>([]);

  const handleClose = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const startDate = startOfMonth(selectedMonth);
    const endDate = endOfMonth(selectedMonth);

    // Filter transactions for selected month
    let monthTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Filter by contact if selected
    if (selectedContact !== 'all') {
      monthTransactions = monthTransactions.filter((t: any) => {
        const contactName = t.type === 'send' ? t.recipient : t.sender;
        return contactName === selectedContact;
      });
    }

    // Calculate monthly statistics
    const stats = monthTransactions.reduce((acc: MonthlyStats, t: any) => {
      if (t.type === 'send') {
        acc.totalSent += Math.abs(t.amount);
        acc.fees += Math.abs(t.amount) * 0.01; // 1% fee
      } else if (t.type === 'receive') {
        acc.totalReceived += t.amount;
      }
      acc.transactionCount++;
      return acc;
    }, {
      totalSent: 0,
      totalReceived: 0,
      transactionCount: 0,
      fees: 0
    });

    setMonthlyStats(stats);

    // Calculate contact statistics
    const contactMap = new Map<string, ContactStats>();
    const allTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    allTransactions.forEach((t: any) => {
      const contactName = t.type === 'send' ? t.recipient : t.sender;
      if (!contactName) return;

      const contact = contactMap.get(contactName) || {
        name: contactName,
        sent: 0,
        received: 0,
        transactionCount: 0
      };

      if (t.type === 'send') {
        contact.sent += Math.abs(t.amount);
      } else {
        contact.received += t.amount;
      }
      contact.transactionCount++;
      contactMap.set(contactName, contact);
    });

    const contacts = Array.from(contactMap.values());
    setContactStats(contacts);
    setAvailableContacts(['all', ...contacts.map(c => c.name)]);
  }, [selectedMonth, selectedContact]);

  const overviewChartData = {
    labels: ['Envoyé', 'Reçu', 'Frais'],
    datasets: [
      {
        label: 'Montant (CFA)',
        data: [monthlyStats.totalSent, monthlyStats.totalReceived, monthlyStats.fees],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const contactsChartData = {
    labels: contactStats.map(c => c.name),
    datasets: [
      {
        label: 'Envoyé',
        data: contactStats.map(c => c.sent),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Reçu',
        data: contactStats.map(c => c.received),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const doughnutData = {
    labels: ['Envoyé', 'Reçu'],
    datasets: [
      {
        data: [monthlyStats.totalSent, monthlyStats.totalReceived],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value: any) => `${value.toLocaleString('fr-FR')} CFA`,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </button>
            <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
              <div className="p-2 rounded-xl bg-indigo-100">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Statistiques</h1>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Month Selector */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <button
                  onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mois précédent"
                >
                  ←
                </button>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMonth(subMonths(selectedMonth, -1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={selectedMonth >= new Date()}
                  aria-label="Mois suivant"
                >
                  →
                </button>
              </div>

              {/* Contact Filter */}
              <div className="relative w-full lg:w-auto">
                <button
                  onClick={() => setShowContactDropdown(!showContactDropdown)}
                  className="w-full lg:w-auto flex items-center justify-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {selectedContact === 'all' ? 'Tous les contacts' : selectedContact}
                  </span>
                  {showContactDropdown ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {showContactDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    {availableContacts.map((contact) => (
                      <button
                        key={contact}
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowContactDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          selectedContact === contact ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                        }`}
                      >
                        {contact === 'all' ? 'Tous les contacts' : contact}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg w-full lg:w-auto">
                <button
                  onClick={() => setView('overview')}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-md transition-colors ${
                    view === 'overview'
                      ? 'bg-white shadow-sm text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Aperçu
                </button>
                <button
                  onClick={() => setView('contacts')}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-md transition-colors ${
                    view === 'contacts'
                      ? 'bg-white shadow-sm text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Contacts
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 mb-1">Total envoyé</p>
                  <p className="text-lg lg:text-2xl font-bold text-red-600">
                    {monthlyStats.totalSent.toLocaleString('fr-FR')} CFA
                  </p>
                </div>
                <div className="p-2 lg:p-3 rounded-full bg-red-100">
                  <svg className="h-4 w-4 lg:h-6 lg:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 mb-1">Total reçu</p>
                  <p className="text-lg lg:text-2xl font-bold text-green-600">
                    {monthlyStats.totalReceived.toLocaleString('fr-FR')} CFA
                  </p>
                </div>
                <div className="p-2 lg:p-3 rounded-full bg-green-100">
                  <svg className="h-4 w-4 lg:h-6 lg:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 mb-1">Transferts</p>
                  <p className="text-lg lg:text-2xl font-bold text-indigo-600">
                    {monthlyStats.transactionCount}
                  </p>
                </div>
                <div className="p-2 lg:p-3 rounded-full bg-indigo-100">
                  <svg className="h-4 w-4 lg:h-6 lg:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 mb-1">Frais payés</p>
                  <p className="text-lg lg:text-2xl font-bold text-blue-600">
                    {monthlyStats.fees.toLocaleString('fr-FR')} CFA
                  </p>
                </div>
                <div className="p-2 lg:p-3 rounded-full bg-blue-100">
                  <svg className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Bar Chart */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm">
              <h3 className="text-base lg:text-lg font-semibold mb-4 text-gray-900">
                {view === 'overview' ? 'Aperçu mensuel' : 'Statistiques par contact'}
              </h3>
              <div className="h-64 lg:h-80">
                <Bar
                  data={view === 'overview' ? overviewChartData : contactsChartData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm">
              <h3 className="text-base lg:text-lg font-semibold mb-4 text-gray-900">Répartition des flux</h3>
              <div className="h-64 lg:h-80">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          {view === 'contacts' && contactStats.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h2 className="text-base lg:text-lg font-semibold mb-6 flex items-center text-gray-900">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Détail par contact
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {contactStats.map((contact) => (
                  <div
                    key={contact.name}
                    className="p-3 lg:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm lg:text-base font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">
                          {contact.transactionCount} transaction{contact.transactionCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {contact.sent > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Envoyé</span>
                          <span className="text-red-600 font-medium">
                            -{contact.sent.toLocaleString('fr-FR')} CFA
                          </span>
                        </div>
                      )}
                      {contact.received > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Reçu</span>
                          <span className="text-green-600 font-medium">
                            +{contact.received.toLocaleString('fr-FR')} CFA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}