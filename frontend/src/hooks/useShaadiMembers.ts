import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

interface ShaadiMember {
  _id: string;
  userId: string;
  role: 'creator' | 'guest';
  name: string;
  profilePic?: string;
  email?: string;
  phone?: string | undefined;
  side?: 'groom' | 'bride';
  relationship?: string;
  createdAt: string;
}

interface UseShaadiMembersReturn {
  members: ShaadiMember[];
  filteredMembers: ShaadiMember[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSide: string;
  setSelectedSide: (side: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sideCounts: { all: number; groom: number; bride: number };
  refresh: () => Promise<void>;
}

export const useShaadiMembers = (shaadiId: string): UseShaadiMembersReturn => {
  const [members, setMembers] = useState<ShaadiMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSide, setSelectedSide] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Smart polling setup
  const [lastPollTime, setLastPollTime] = useState(0);
  const POLL_INTERVAL = 30000; // 30 seconds

  const loadMembers = useCallback(async () => {
    if (!shaadiId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getShaadiMembers(shaadiId);
      setMembers(data.members || []);
      setLastPollTime(Date.now());
    } catch (err: any) {
      setError(err.message || 'Failed to load members');
      console.error('Error loading shaadi members:', err);
    } finally {
      setLoading(false);
    }
  }, [shaadiId]);

  // Initial load
  useEffect(() => {
    if (shaadiId) {
      loadMembers();
    }
  }, [shaadiId, loadMembers]);

  // Smart polling - only when tab is active
  useEffect(() => {
    if (!shaadiId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh immediately when tab becomes visible
        const timeSinceLastPoll = Date.now() - lastPollTime;
        if (timeSinceLastPoll > POLL_INTERVAL) {
          loadMembers();
        }
      }
    };

    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadMembers();
      }
    }, POLL_INTERVAL);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shaadiId, loadMembers, lastPollTime]);

  // Client-side search and filter
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower)
      );
    }

    // Side filter
    if (selectedSide !== 'all') {
      filtered = filtered.filter(member => member.side === selectedSide);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'side':
          return (a.side || '').localeCompare(b.side || '');
        case 'relationship':
          return (a.relationship || '').localeCompare(b.relationship || '');
        case 'joinDate':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, searchTerm, selectedSide, sortBy]);

  // Calculate dynamic counts
  const sideCounts = useMemo(() => {
    const all = filteredMembers.length;
    const groom = filteredMembers.filter(m => m.side === 'groom').length;
    const bride = filteredMembers.filter(m => m.side === 'bride').length;
    
    return { all, groom, bride };
  }, [filteredMembers]);

  return {
    members,
    filteredMembers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSide,
    setSelectedSide,
    sortBy,
    setSortBy,
    sideCounts,
    refresh: loadMembers
  };
};

// WebSocket preparation (commented for future use)
/*
export const useShaadiMembersWebSocket = (shaadiId: string) => {
  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://localhost:5000/shaadi/${shaadiId}/members`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle real-time updates
      // - member_joined
      // - member_updated
      // - member_blocked
    };

    return () => ws.close();
  }, [shaadiId]);
};
*/ 