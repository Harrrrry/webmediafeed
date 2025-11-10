import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../common/constants/roles';

export type ShaadiMemberDocument = ShaadiMember & Document;

@Schema({ timestamps: true })
export class ShaadiMember {
  @Prop({ type: Types.ObjectId, ref: 'Shaadi', required: true })
  shaadiId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(UserRole) })
  role: string; // 'creator', 'guest', 'relative', etc.

  @Prop({ required: true, unique: true })
  code: string; // 6-digit code specific to this user+shaadi pair

  @Prop({ default: false })
  blocked: boolean;

  // Guest-specific fields (only populated for guests)
  @Prop()
  name?: string; // Guest's name

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  profilePic?: string; // Profile picture URL for the guest

  @Prop({ enum: ['groom', 'bride'] })
  side?: string; // 'groom' or 'bride'

  @Prop()
  relationship?: string;

  @Prop({ default: false })
  showContact?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ShaadiMember' })
  invitedBy?: Types.ObjectId; // References the creator's ShaadiMember ID
}

export const ShaadiMemberSchema = SchemaFactory.createForClass(ShaadiMember);

// Create compound index for efficient queries
ShaadiMemberSchema.index({ shaadiId: 1, userId: 1 }, { unique: true });
ShaadiMemberSchema.index({ userId: 1, code: 1 }); 