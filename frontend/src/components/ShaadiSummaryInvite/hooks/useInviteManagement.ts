import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import type { Invite, GuestData } from '../types';

export const useInviteManagement = (shaadiId: string) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [deleteInviteDialogOpen, setDeleteInviteDialogOpen] = useState(false);

  const loadInvites = async () => {
    try {
      const invites = await api.getInvites(shaadiId);
      setInvites(invites);
    } catch (error) {
      console.error('Failed to load invites:', error);
    }
  };

  const addGuest = async (guestData: GuestData) => {
    if (!shaadiId) throw new Error('Shaadi ID is required');
    
    try {
      await api.createInvite(shaadiId, guestData);
      await loadInvites(); // Refresh the list
      return { success: true, message: 'Guest invited successfully!' };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to invite guest');
    }
  };

  const deleteInvite = async (inviteId: string) => {
    try {
      const response = await api.deleteInvite(shaadiId, inviteId);
      setDeleteInviteDialogOpen(false);
      setSelectedInvite(null);
      await loadInvites(); // Refresh the list
      return { success: true, message: response?.message || 'Invitation deleted successfully!' };
    } catch (err: any) {
      console.error('Delete invite error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete invitation';
      return { success: false, message: errorMessage };
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      const response = await api.resendInvite(shaadiId, inviteId);
      await loadInvites(); // Refresh to get updated reminder count
      return { success: true, message: response?.message || 'Invitation resent successfully!' };
    } catch (err: any) {
      console.error('Resend invite error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend invitation';
      return { success: false, message: errorMessage };
    }
  };

  const getInviteStats = () => {
    const total = invites.length;
    const joined = invites.filter(i => i.status === 'joined').length;
    const pending = invites.filter(i => i.status === 'pending').length;
    
    return { total, joined, pending };
  };

  return {
    // State
    invites,
    loadingInvites,
    selectedInvite,
    setSelectedInvite,
    deleteInviteDialogOpen,
    setDeleteInviteDialogOpen,

    // Actions
    loadInvites,
    addGuest,
    deleteInvite,
    resendInvite,
    getInviteStats,
  };
}; 