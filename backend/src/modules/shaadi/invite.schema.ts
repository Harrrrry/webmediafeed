import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InviteDocument = Invite & Document;

export enum InviteStatus {
  PENDING = 'pending',
  SENT = 'sent',
  JOINED = 'joined',
  DECLINED = 'declined',
  EXPIRED = 'expired'
}

@Schema({ timestamps: true })
export class Invite {
  @Prop({ type: Types.ObjectId, ref: 'Shaadi', required: true })
  shaadiId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Creator who sent the invite

  @Prop()
  guestName?: string; // Will be filled when guest joins

  @Prop()
  guestEmail?: string; // Either email or phone is required

  @Prop()
  guestPhone?: string; // Either email or phone is required

  @Prop()
  relationship?: string; // Will be filled when guest joins

  @Prop({ enum: ['groom', 'bride'] })
  side?: string; // Will be filled when guest joins

  @Prop({ 
    type: String, 
    enum: InviteStatus, 
    default: InviteStatus.PENDING 
  })
  status: InviteStatus;

  @Prop()
  inviteLink: string; // Generated unique invite link

  @Prop({ required: true })
  inviteCode: string; // 6-digit code for this specific invite

  @Prop()
  sentAt?: Date; // When invite was sent

  @Prop()
  joinedAt?: Date; // When guest joined

  @Prop()
  declinedAt?: Date; // When guest declined

  @Prop()
  expiresAt?: Date; // Invite expiration date

  @Prop()
  message?: string; // Custom message from creator

  @Prop({ default: false })
  showContact: boolean; // Whether guest allows contact visibility

  @Prop()
  notes?: string; // Creator's notes about this guest

  @Prop({ type: Types.ObjectId, ref: 'User' })
  guestUserId?: Types.ObjectId; // If guest registered, link to their user account

  @Prop({ default: 0 })
  reminderCount: number; // Number of reminders sent

  @Prop()
  lastReminderSent?: Date;

  // Tracking fields
  @Prop()
  openedAt?: Date; // When invite was opened

  @Prop()
  clickedAt?: Date; // When invite link was clicked

  @Prop({ default: 0 })
  openCount: number; // How many times invite was opened

  @Prop({ default: 0 })
  clickCount: number; // How many times link was clicked

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);

// Indexes for better query performance
InviteSchema.index({ shaadiId: 1, status: 1 });
InviteSchema.index({ createdBy: 1 });
InviteSchema.index({ inviteCode: 1 }, { unique: true });
InviteSchema.index({ inviteLink: 1 });
InviteSchema.index({ guestEmail: 1, shaadiId: 1 });
InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for expired invites 