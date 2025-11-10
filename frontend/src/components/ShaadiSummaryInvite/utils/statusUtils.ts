import { InviteStatus, GuestSide } from '../types';

export const getStatusColor = (status: InviteStatus): string => {
  const statusColors: Record<InviteStatus, string> = {
    [InviteStatus.JOINED]: 'success',
    [InviteStatus.SENT]: 'info',
    [InviteStatus.PENDING]: 'warning',
    [InviteStatus.DECLINED]: 'error',
    [InviteStatus.EXPIRED]: 'default'
  };
  return statusColors[status] || 'default';
};

export const getStatusIcon = (status: InviteStatus): string => {
  const statusIcons: Record<InviteStatus, string> = {
    [InviteStatus.JOINED]: '✅',
    [InviteStatus.SENT]: '📧',
    [InviteStatus.PENDING]: '⏳',
    [InviteStatus.DECLINED]: '❌',
    [InviteStatus.EXPIRED]: '⏰'
  };
  return statusIcons[status] || '⏳';
};

export const getSideColor = (side: GuestSide): string => {
  if (!side) return 'default';
  return side === GuestSide.GROOM ? 'primary' : 'error'; // error gives pink/red color for bride
};

export const getSideLabel = (side: GuestSide): string | null => {
  if (!side) return null;
  return side === GuestSide.GROOM ? 'Groom Side' : 'Bride Side';
};

export const isInviteActionable = (status: InviteStatus): boolean => {
  return status !== InviteStatus.JOINED && status !== InviteStatus.DECLINED;
}; 