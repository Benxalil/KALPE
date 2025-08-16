import { Transaction } from '../types/transaction';

// Get stored transactions from localStorage
const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');

export const transactions: Transaction[] = [
  ...storedTransactions,
  {
    id: 1,
    type: 'send',
    amount: -50000,
    recipient: 'Alice Martin',
    date: new Date(2024, 2, 15),
    category: 'resto',
    description: 'Déjeuner',
    details: {
      reference: 'TR-2024031501',
      restaurantName: 'Le Petit Bistrot',
      address: '15 Rue de la Paix, Dakar',
      time: '12:30',
    },
  },
  {
    id: 2,
    type: 'receive',
    amount: 75000,
    sender: 'Marie Diop',
    date: new Date(2024, 2, 14),
    category: 'banque',
    description: 'Transfert bancaire',
    details: {
      reference: 'TR-2024031402',
      bankName: 'BOA Sénégal',
      time: '15:45',
    },
  },
  {
    id: 3,
    type: 'send',
    amount: -25000,
    recipient: 'SEN\'EAU',
    date: new Date(2024, 2, 13),
    category: 'facture',
    description: 'Facture d\'eau',
    details: {
      reference: 'TR-2024031303',
      companyName: 'SEN\'EAU',
      time: '09:15',
    },
  },
  {
    id: 4,
    type: 'send',
    amount: -15000,
    recipient: 'Orange',
    date: new Date(2024, 2, 12),
    category: 'facture',
    description: 'Recharge crédit',
    details: {
      reference: 'TR-2024031204',
      companyName: 'Orange',
      time: '18:20',
    },
  },
  {
    id: 5,
    type: 'receive',
    amount: 100000,
    sender: 'Ibrahima Sow',
    date: new Date(2024, 2, 11),
    category: 'banque',
    description: 'Remboursement',
    details: {
      reference: 'TR-2024031105',
      bankName: 'Ecobank',
      time: '14:30',
    },
  },
  {
    id: 6,
    type: 'send',
    amount: -35000,
    recipient: 'Restaurant Le Baobab',
    date: new Date(2024, 2, 10),
    category: 'resto',
    description: 'Dîner professionnel',
    details: {
      reference: 'TR-2024031006',
      restaurantName: 'Le Baobab',
      address: '25 Avenue Cheikh Anta Diop, Dakar',
      time: '20:45',
    },
  },
  {
    id: 7,
    type: 'send',
    amount: -45000,
    recipient: 'Senelec',
    date: new Date(2024, 2, 9),
    category: 'facture',
    description: 'Facture d\'électricité',
    details: {
      reference: 'TR-2024030907',
      companyName: 'Senelec',
      time: '11:25',
    },
  },
];