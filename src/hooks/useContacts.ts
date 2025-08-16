import { useState, useEffect } from 'react';
import { Contact } from '../types/contact';

// Simulated contacts data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Martin',
    phone: '+221 77 123 45 67',
    hasKalpeAccount: true,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    phone: '+221 76 234 56 78',
    hasKalpeAccount: false,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    phone: '+221 70 345 67 89',
    hasKalpeAccount: true,
  },
  {
    id: '4',
    name: 'David Wilson',
    phone: '+221 78 456 78 90',
    hasKalpeAccount: false,
  },
  {
    id: '5',
    name: 'Emma Davis',
    phone: '+221 75 567 89 01',
    hasKalpeAccount: true,
  },
];

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sort contacts alphabetically
        const sortedContacts = [...mockContacts].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setContacts(sortedContacts);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contacts, isLoading, error };
}