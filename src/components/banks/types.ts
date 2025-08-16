export interface Bank {
  id: string;
  name: string;
  logo: string;
}

export interface BankListProps {
  onNavigateBack?: () => void;
}

export interface ComingSoonModalProps {
  bank: Bank;
  onClose: () => void;
}