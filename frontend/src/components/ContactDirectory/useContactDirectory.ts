import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { api } from '../../services/api';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  side: 'groom' | 'bride';
  contactNumber?: string;
  showContact: boolean;
  profilePicture?: string;
  isBlocked?: boolean;
}

export function useContactDirectory() {
  const { currentShaadi } = useSelector((state: RootState) => state.shaadi);
  const { user } = useSelector((state: RootState) => state.auth);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentShaadi) {
      fetchContacts();
    }
  }, [currentShaadi]);

  const fetchContacts = async () => {
    if (!currentShaadi) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual API call
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'Priya Sharma',
          relationship: 'Cousin',
          side: 'bride',
          contactNumber: '+919876543210',
          showContact: true,
          profilePicture: undefined,
        },
        {
          id: '2',
          name: 'Amit Patel',
          relationship: 'Friend',
          side: 'groom',
          contactNumber: '+919876543211',
          showContact: false,
          profilePicture: undefined,
        },
        {
          id: '3',
          name: 'Neha Singh',
          relationship: 'Sister',
          side: 'bride',
          contactNumber: '+919876543212',
          showContact: true,
          profilePicture: undefined,
        },
        {
          id: '4',
          name: 'Rajesh Kumar',
          relationship: 'Uncle',
          side: 'groom',
          contactNumber: '+919876543213',
          showContact: false,
          profilePicture: undefined,
        },
      ];
      
      setContacts(mockContacts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockContact = async (contactId: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Blocking contact:', contactId);
      
      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, isBlocked: true }
            : contact
        )
      );
    } catch (err: any) {
      console.error('Failed to block contact:', err);
    }
  };

  const handleReportContact = async (contactId: string, reason: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Reporting contact:', contactId, 'Reason:', reason);
      
      // In a real implementation, this would send the report to the backend
      // For now, we'll just log it
    } catch (err: any) {
      console.error('Failed to report contact:', err);
    }
  };

  const handleToggleContactVisibility = async (contactId: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Toggling contact visibility:', contactId);
      
      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, showContact: !contact.showContact }
            : contact
        )
      );
    } catch (err: any) {
      console.error('Failed to toggle contact visibility:', err);
    }
  };

  return {
    contacts,
    loading,
    error,
    handleBlockContact,
    handleReportContact,
    handleToggleContactVisibility,
  };
} 