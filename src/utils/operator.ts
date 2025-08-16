interface Operator {
  name: string;
  logo: string;
  bgColor: string;
  prefixes: string[];
}

const operators: Operator[] = [
  {
    name: 'Orange',
    logo: '/logos/orange.png',
    bgColor: 'bg-orange-100 text-orange-800',
    prefixes: ['77', '78'],
  },
  {
    name: 'Free',
    logo: '/crffrh',
    bgColor: 'bg-red-100 text-red-800',
    prefixes: ['76'],
  },
  {
    name: 'Expresso',
    logo: '/logos/expresso.png',
    bgColor: 'bg-blue-100 text-blue-800',
    prefixes: ['70'],
  },
  {
    name: 'ProMobile',
    logo: '/logos/promobile.png',
    bgColor: 'bg-purple-100 text-purple-800',
    prefixes: ['75'],
  },
];

export function getOperatorInfo(phoneNumber: string): Operator | null {
  // Remove any spaces or special characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Senegalese number
  if (!cleanNumber.match(/^(70|75|76|77|78)\d{7}$/)) {
    return null;
  }

  // Get the prefix (first two digits)
  const prefix = cleanNumber.substring(0, 2);
  
  // Find the matching operator
  return operators.find(op => op.prefixes.includes(prefix)) || null;
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return /^(70|75|76|77|78)\d{7}$/.test(cleanNumber);
}