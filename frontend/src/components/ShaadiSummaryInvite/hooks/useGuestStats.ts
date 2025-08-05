import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../services/api';

interface GuestStats {
  pending: any[];
  joinedCount: number;
  total: number;
}

interface UseGuestStatsReturn {
  stats: GuestStats;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useGuestStats = (shaadiId: string): UseGuestStatsReturn => {
  const [stats, setStats] = useState<GuestStats>({
    pending: [],
    joinedCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!shaadiId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getGuestStats(shaadiId);
      setStats({
        pending: data.pending || [],
        joinedCount: data.joinedCount || 0,
        total: data.total || 0
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load guest stats');
      console.error('Error loading guest stats:', err);
    } finally {
      setLoading(false);
    }
  }, [shaadiId]);

  useEffect(() => {
    if (shaadiId) {
      loadStats();
    }
  }, [shaadiId, loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  };
}; 