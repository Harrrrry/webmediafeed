import { api } from '../../services/api';

export function useGuestManagement() {
  const fetchInvites = async (shaadiId: string) => {
    try {
      const response = await api.getInvites(shaadiId);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch invites');
    }
  };

  const createInvite = async (shaadiId: string, inviteData: any) => {
    try {
      const response = await api.createInvite(shaadiId, inviteData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create invite');
    }
  };

  const deleteInvite = async (inviteId: string) => {
    try {
      const response = await api.deleteInvite(inviteId);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete invite');
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      const response = await api.resendInvite(inviteId);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend invite');
    }
  };

  const updateInviteNotes = async (inviteId: string, notes: string) => {
    try {
      const response = await api.updateInviteNotes(inviteId, notes);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update invite notes');
    }
  };

  return {
    fetchInvites,
    createInvite,
    deleteInvite,
    resendInvite,
    updateInviteNotes,
  };
} 