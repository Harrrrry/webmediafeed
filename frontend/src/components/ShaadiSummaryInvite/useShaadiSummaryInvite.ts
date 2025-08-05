import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Shaadi, GuestData } from './types';
import { useInviteManagement } from './hooks/useInviteManagement';
import { useCardSharing } from './hooks/useCardSharing';
import { useShaadiDeletion } from './hooks/useShaadiDeletion';
import { useErrorHandling } from './hooks/useErrorHandling';

export const useShaadiSummaryInvite = (shaadi: Shaadi) => {
  // Basic state
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [inviteMenuAnchor, setInviteMenuAnchor] = useState<null | HTMLElement>(null);

  // Specialized hooks
  const errorHandling = useErrorHandling();
  const inviteManagement = useInviteManagement(shaadi._id || shaadi.id || '');
  const cardSharing = useCardSharing(shaadi);
  const shaadiDeletion = useShaadiDeletion(shaadi._id || shaadi.id || '', shaadi.name);

  // Load invites when component mounts
  useEffect(() => {
    if (shaadi && activeTab === 1) {
      inviteManagement.loadInvites().catch(errorHandling.handleError);
    }
  }, [shaadi, activeTab]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      errorHandling.handleError('Please enter an email or phone number');
      return;
    }

    setLoading(true);
    try {
      const shaadiId = shaadi._id || shaadi.id;
      if (!shaadiId) {
        throw new Error('Shaadi ID is required');
      }
      
      // Only send email/phone, guest details will be filled when they join
      const inviteData: any = {};
      
      // Check if it's an email or phone
      if (contact.trim().includes('@')) {
        inviteData.guestEmail = contact.trim();
      } else {
        inviteData.guestPhone = contact.trim();
      }
      
      await api.createInvite(shaadiId, inviteData);
      errorHandling.handleSuccess('Invite sent!');
      setContact('');
      // Refresh the invites list
      await inviteManagement.loadInvites();
    } catch (err: any) {
      errorHandling.handleError(err.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteInvite = async () => {
    if (!inviteManagement.selectedInvite) return;
    
    const result = await inviteManagement.deleteInvite(inviteManagement.selectedInvite.id);
    if (result) {
      errorHandling.handleSuccess(result.message);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    const result = await inviteManagement.resendInvite(inviteId);
    if (result) {
      errorHandling.handleSuccess(result.message);
    }
  };

  const handleShareCard = async () => {
    try {
      await cardSharing.shareCard();
      errorHandling.handleSuccess('Invitation card shared successfully!');
    } catch (err: any) {
      errorHandling.handleError(err.message);
    }
  };

  const handleDeleteShaadi = async () => {
    try {
      await shaadiDeletion.handleDeleteShaadi();
      errorHandling.handleSuccess('Shaadi deleted successfully');
    } catch (err: any) {
      errorHandling.handleError(err.message);
    }
  };

  return {
    // State
    contact,
    setContact,
    loading,
    activeTab,
    setActiveTab,

    inviteMenuAnchor,
    setInviteMenuAnchor,

    // Error handling
    error: errorHandling.error,
    success: errorHandling.success,
    handleSuccess: errorHandling.handleSuccess,

    // Card sharing
    sharingCard: cardSharing.sharingCard,
    cardRef: cardSharing.cardRef,

    // Invite management
    invites: inviteManagement.invites,
    loadingInvites: inviteManagement.loadingInvites,
    selectedInvite: inviteManagement.selectedInvite,
    setSelectedInvite: inviteManagement.setSelectedInvite,
    deleteInviteDialogOpen: inviteManagement.deleteInviteDialogOpen,
    setDeleteInviteDialogOpen: inviteManagement.setDeleteInviteDialogOpen,
    getInviteStats: inviteManagement.getInviteStats,

    // Shaadi deletion
    deleteDialogOpen: shaadiDeletion.deleteDialogOpen,
    confirmText: shaadiDeletion.confirmText,
    setConfirmText: shaadiDeletion.setConfirmText,
    deleteReason: shaadiDeletion.deleteReason,
    setDeleteReason: shaadiDeletion.setDeleteReason,
    deleting: shaadiDeletion.deleting,

    // Actions
    handleInvite,
    handleShareCard,
    handleDeleteShaadi,
    handleDeleteDialogClose: shaadiDeletion.handleDeleteDialogClose,

    handleDeleteInvite,
    handleResendInvite,
    openDeleteDialog: shaadiDeletion.openDeleteDialog,
  };
}; 