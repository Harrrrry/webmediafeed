export interface Invite {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  relationship: string;
  side: 'groom' | 'bride';
  status: InviteStatus;
  inviteCode: string;
  inviteLink: string;
  sentAt?: string;
  joinedAt?: string;
  declinedAt?: string;
  expiresAt?: string;
  message?: string;
  notes?: string;
  openCount: number;
  clickCount: number;
  reminderCount: number;
  lastReminderSent?: string;
  createdAt: string;
}

export const InviteStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  JOINED: 'joined',
  DECLINED: 'declined',
  EXPIRED: 'expired'
} as const;

export type InviteStatus = typeof InviteStatus[keyof typeof InviteStatus];

export const GuestSide = {
  GROOM: 'groom',
  BRIDE: 'bride'
} as const;

export type GuestSide = typeof GuestSide[keyof typeof GuestSide];

export interface Shaadi {
  _id: string;
  id?: string;
  name: string;
  brideName: string;
  groomName: string;
  date: string;
  location: string;
  creatorCode: string;
  createdBy: string;
  image?: string;
}

export interface GuestData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  relationship: string;
  side: GuestSide;
  message?: string;
}

export interface InviteMenuAction {
  label: string;
  icon: React.ComponentType;
  action: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
} 