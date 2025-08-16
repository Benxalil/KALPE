export interface Transaction {
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
}