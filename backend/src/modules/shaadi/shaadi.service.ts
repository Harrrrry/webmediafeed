import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shaadi, ShaadiDocument } from './shaadi.schema';
import { ShaadiMember, ShaadiMemberDocument } from './shaadi-member.schema';
import { Invite, InviteDocument } from './invite.schema';
import { User, UserDocument } from '../users/user.schema';
import { UserRole } from '../../common/constants/roles';

@Injectable()
export class ShaadiService {
  constructor(
    @InjectModel(Shaadi.name) private readonly shaadiModel: Model<ShaadiDocument>,
    @InjectModel(ShaadiMember.name) private readonly shaadiMemberModel: Model<ShaadiMemberDocument>,
    @InjectModel(Invite.name) private readonly inviteModel: Model<InviteDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createShaadi(body: any): Promise<any> {
    const { name, brideName, groomName, date, location, image, createdBy } = body;
    if (!name || !brideName || !groomName || !date || !createdBy) {
      throw new BadRequestException('Missing required fields');
    }

    // Check if user already has an active (not soft-deleted) shaadi
    const existingMembership = await this.shaadiMemberModel.findOne({
      userId: createdBy,
      role: UserRole.CREATOR
    }).populate({
      path: 'shaadiId',
      match: { isDeleted: false }
    });

    if (existingMembership && existingMembership.shaadiId) {
      throw new BadRequestException('You can only create one active Shaadi at a time');
    }

    // Fetch creator's user data to include in ShaadiMember
    const creatorUser = await this.userModel.findById(createdBy).select('username profilePicUrl');
    if (!creatorUser) {
      throw new BadRequestException('Creator user not found');
    }

    const shaadi = new this.shaadiModel({
      name,
      brideName,
      groomName,
      date,
      location,
      image,
      createdBy,
    });
    await shaadi.save();

    // Add creator as a member with role 'creator' and include user data
    const creatorCode = this.generateSixDigitCode();
    await this.shaadiMemberModel.create({
      shaadiId: shaadi._id,
      userId: new Types.ObjectId(createdBy),
      role: UserRole.CREATOR,
      code: creatorCode,
      blocked: false,
      // Creator-specific fields (aligning with guest fields)
      name: creatorUser.username, // Use username as name for consistency
      profilePic: creatorUser.profilePicUrl || null, // Will be updated later through the application
    });

    return { ...shaadi.toObject(), creatorCode };
  }

  async generateInvite(body: any): Promise<any> {
    const { shaadiId, guestEmail, createdBy } = body;
    
    if (!shaadiId || !guestEmail || !createdBy) {
      throw new BadRequestException('Missing required fields: shaadiId, guestEmail, createdBy');
    }

    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      userId: new Types.ObjectId(createdBy),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can send invitations');
    }

    // Check if invite already exists for this guest
    const existingInvite = await this.inviteModel.findOne({
      shaadiId,
      guestEmail: guestEmail
    });

    if (existingInvite) {
      throw new BadRequestException('Invitation already sent to this guest');
    }

    // Generate unique invite code and link
    const inviteCode = this.generateInviteCode();
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join?code=${inviteCode}`;

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const invite = new this.inviteModel({
      shaadiId,
      createdBy,
      guestName: guestEmail.split('@')[0], // Use email prefix as name
      guestEmail: guestEmail,
      relationship: 'Guest',
      side: 'groom', // Default to groom side
      inviteCode,
      inviteLink,
      expiresAt,
      status: 'pending'
    });

    await invite.save();

    return {
      success: true,
      message: 'Invitation sent successfully!',
      invite: {
        id: invite._id,
        inviteCode,
        inviteLink,
        status: invite.status,
        expiresAt: invite.expiresAt
      }
    };
  }

  async redeemInvite(body: any): Promise<any> {
    // TODO: Implement actual logic
    return { message: 'redeemInvite called', body };
  }

  async getUserShaadis(userId: string): Promise<any[]> {
    const memberships = await this.shaadiMemberModel.find({
      userId: new Types.ObjectId(userId),
      blocked: false
    }).populate('shaadiId').exec();

    // Filter out memberships where the shaadi was deleted or doesn't exist
    const validMemberships = memberships.filter(membership => {
      // Check if shaadiId is populated (has _id property) and not deleted
      return membership.shaadiId && 
             typeof membership.shaadiId === 'object' && 
             '_id' in membership.shaadiId &&
             !(membership.shaadiId as any).isDeleted;
    });

    return validMemberships.map(membership => ({
      shaadi: membership.shaadiId,
      role: membership.role,
      code: membership.code
    }));
  }

  async getShaadiById(id: string, userId: string): Promise<any> {
    const shaadi = await this.shaadiModel.findById(id).exec();
    if (!shaadi) {
      throw new BadRequestException('Shaadi not found');
    }
    
    // Check if user is a member of this shaadi
    const membership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
      blocked: false
    });

    if (!membership) {
      throw new BadRequestException('Access denied');
    }
    
    return { ...shaadi.toObject(), userRole: membership.role };
  }

  async verifyShaadiCode(userId: string, code: string): Promise<any> {
    const membership = await this.shaadiMemberModel.findOne({
      userId: new Types.ObjectId(userId),
      code,
      blocked: false
    }).populate('shaadiId').exec();

    if (!membership) {
      throw new BadRequestException('Invalid code or access denied');
    }

    return {
      shaadi: membership.shaadiId,
      role: membership.role
    };
  }

  async blockMember(creatorId: string, shaadiId: string, memberUserId: string): Promise<any> {
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      userId: new Types.ObjectId(creatorId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can block members');
    }

    // Block the member
    const result = await this.shaadiMemberModel.updateOne(
      { shaadiId: new Types.ObjectId(shaadiId), userId: new Types.ObjectId(memberUserId) },
      { blocked: true }
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('Member not found');
    }

    return { success: true, message: 'Member blocked successfully' };
  }

  async unblockMember(creatorId: string, shaadiId: string, memberUserId: string): Promise<any> {
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      userId: new Types.ObjectId(creatorId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can unblock members');
    }

    // Unblock the member
    const result = await this.shaadiMemberModel.updateOne(
      { shaadiId: new Types.ObjectId(shaadiId), userId: new Types.ObjectId(memberUserId) },
      { blocked: false }
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('Member not found');
    }

    return { success: true, message: 'Member unblocked successfully' };
  }

  async deleteShaadi(shaadiId: string, userId: string, reason?: string): Promise<any> {
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      userId: new Types.ObjectId(userId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can delete the Shaadi');
    }

    // Check if Shaadi exists and is not already deleted
    const shaadi = await this.shaadiModel.findOne({
      _id: shaadiId,
      isDeleted: false
    });

    if (!shaadi) {
      throw new BadRequestException('Shaadi not found or already deleted');
    }

    // Soft delete the Shaadi
    const result = await this.shaadiModel.updateOne(
      { _id: shaadiId },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
        deleteReason: reason
      }
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('Failed to delete Shaadi');
    }

    return { success: true, message: 'Shaadi deleted successfully' };
  }

  // Invitation Management Methods
  async createInvite(shaadiId: string, creatorId: string, inviteData: any): Promise<any> {
    // Convert string IDs to ObjectIds
    const shaadiObjectId = new Types.ObjectId(shaadiId);
    const creatorObjectId = new Types.ObjectId(creatorId);
    
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: shaadiObjectId,
      userId: creatorObjectId,
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can send invitations');
    }

    // Only require email or phone, not all guest details
    if (!inviteData.guestEmail && !inviteData.guestPhone) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Check if invite already exists for this guest
    const existingInvite = await this.inviteModel.findOne({
      shaadiId: shaadiObjectId,
      $or: [
        { guestEmail: inviteData.guestEmail },
        { guestPhone: inviteData.guestPhone }
      ].filter(condition => condition.guestEmail || condition.guestPhone)
    });

    if (existingInvite) {
      throw new BadRequestException('Invitation already sent to this guest');
    }

    // Generate unique invite code and link
    let inviteCode: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      inviteCode = this.generateInviteCode();
      attempts++;
      
      console.log(`[createInvite] Attempt ${attempts}: Generated code ${inviteCode}`);
      
      // Check if code already exists
      const existingCode = await this.inviteModel.findOne({ inviteCode });
      if (!existingCode) {
        console.log(`[createInvite] Code ${inviteCode} is unique, proceeding`);
        break;
      }
      
      console.log(`[createInvite] Code ${inviteCode} already exists, retrying...`);
      
      if (attempts >= maxAttempts) {
        console.log(`[createInvite] Failed to generate unique code after ${maxAttempts} attempts`);
        throw new BadRequestException('Failed to generate unique invite code after multiple attempts');
      }
    } while (true);
    
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join?code=${inviteCode}`;

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const invite = new this.inviteModel({
      shaadiId: shaadiObjectId,
      createdBy: creatorObjectId,
      guestEmail: inviteData.guestEmail,
      guestPhone: inviteData.guestPhone,
      // Guest details will be filled when they join
      guestName: null,
      relationship: null,
      side: null,
      inviteCode,
      inviteLink,
      expiresAt,
      message: inviteData.message,
      status: 'pending'
    });

    try {
      await invite.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error - try again with a new code
        throw new BadRequestException('Failed to create invite due to duplicate code. Please try again.');
      }
      throw new BadRequestException('Failed to create invite: ' + error.message);
    }

    return {
      success: true,
      invite: {
        id: invite._id,
        inviteCode,
        inviteLink,
        status: invite.status,
        expiresAt: invite.expiresAt
      }
    };
  }

  async getInvites(shaadiId: string, creatorId: string): Promise<any> {
    // Convert string IDs to ObjectIds
    const shaadiObjectId = new Types.ObjectId(shaadiId);
    const creatorObjectId = new Types.ObjectId(creatorId);
    
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: shaadiObjectId,
      userId: creatorObjectId,
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can view invitations');
    }

    const invites = await this.inviteModel.find({ shaadiId: shaadiObjectId })
      .sort({ createdAt: -1 })
      .populate('guestUserId', 'username email name');

    return {
      success: true,
      invites: invites.map(invite => ({
        id: invite._id,
        guestEmail: invite.guestEmail,
        guestPhone: invite.guestPhone,
        guestName: invite.guestName,
        relationship: invite.relationship,
        side: invite.side,
        inviteCode: invite.inviteCode,
        inviteLink: invite.inviteLink,
        status: invite.status,
        expiresAt: invite.expiresAt,
        message: invite.message,
        clickCount: invite.clickCount,
        createdAt: invite.createdAt
      }))
    };
  }

  async updateInviteStatus(inviteId: string, status: string, userId?: string): Promise<any> {
    const invite = await this.inviteModel.findById(inviteId);
    
    if (!invite) {
      throw new BadRequestException('Invitation not found');
    }

    const updateData: any = { status };
    
    switch (status) {
      case 'sent':
        updateData.sentAt = new Date();
        break;
      case 'joined':
        updateData.joinedAt = new Date();
        if (userId) {
          updateData.guestUserId = userId;
        }
        break;
      case 'declined':
        updateData.declinedAt = new Date();
        break;
      case 'expired':
        // Status will be automatically updated by TTL index
        break;
    }

    await this.inviteModel.findByIdAndUpdate(inviteId, updateData);

    return { success: true, message: 'Invitation status updated' };
  }

  async resendInvite(inviteId: string, creatorId: string): Promise<any> {
    const invite = await this.inviteModel.findById(inviteId);
    
    if (!invite) {
      throw new BadRequestException('Invitation not found');
    }

    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: invite.shaadiId,
      userId: new Types.ObjectId(creatorId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can resend invitations');
    }

    // Update reminder count and last sent date
    await this.inviteModel.findByIdAndUpdate(inviteId, {
      $inc: { reminderCount: 1 },
      lastReminderSent: new Date()
    });

    return { success: true, message: 'Invitation resent successfully' };
  }

  async deleteInvite(inviteId: string, creatorId: string): Promise<any> {
    const invite = await this.inviteModel.findById(inviteId);
    
    if (!invite) {
      throw new BadRequestException('Invitation not found');
    }

    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: invite.shaadiId,
      userId: new Types.ObjectId(creatorId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can delete invitations');
    }

    await this.inviteModel.findByIdAndDelete(inviteId);

    return { success: true, message: 'Invitation deleted successfully' };
  }

  async trackInviteOpen(inviteCode: string): Promise<any> {
    const invite = await this.inviteModel.findOne({ inviteCode });
    
    if (!invite) {
      throw new BadRequestException('Invalid invite code');
    }

    await this.inviteModel.findByIdAndUpdate(invite._id, {
      $inc: { openCount: 1 },
      openedAt: new Date()
    });

    return { success: true };
  }

  async trackInviteClick(inviteCode: string): Promise<any> {
    const invite = await this.inviteModel.findOne({ inviteCode });
    
    if (!invite) {
      throw new BadRequestException('Invalid invite code');
    }

    await this.inviteModel.findByIdAndUpdate(invite._id, {
      $inc: { clickCount: 1 },
      clickedAt: new Date()
    });

    return { success: true };
  }

  async getGuestStats(shaadiId: string): Promise<any> {
    // Verify the requester is the creator
    const creatorMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      role: UserRole.CREATOR
    });

    if (!creatorMembership) {
      throw new BadRequestException('Only the creator can view guest stats');
    }

    // Optimized parallel queries
    const [pendingInvites, joinedCount, totalInvites] = await Promise.all([
      // Get pending invites with minimal fields including inviteCode for copy link
      this.inviteModel.find({ 
        shaadiId: new Types.ObjectId(shaadiId), 
        status: 'pending' 
      }).select('guestName guestEmail guestPhone relationship side status createdAt _id inviteCode inviteLink').lean(),
      
      // Count joined members
      this.shaadiMemberModel.countDocuments({ 
        shaadiId: new Types.ObjectId(shaadiId), 
        role: UserRole.GUEST 
      }),
      
      // Count total invites
      this.inviteModel.countDocuments({ 
        shaadiId: new Types.ObjectId(shaadiId) 
      })
    ]);

    // Transform _id to id for frontend compatibility
    const transformedPendingInvites = pendingInvites.map(invite => ({
      ...invite,
      id: invite._id.toString()
    }));

    return {
      pending: transformedPendingInvites,
      joinedCount,
      total: totalInvites + joinedCount
    };
  }

  async getShaadiMembers(shaadiId: string, currentUserId: string): Promise<any> {
    // Verify the user is a member of this shaadi
    const userMembership = await this.shaadiMemberModel.findOne({
      shaadiId: new Types.ObjectId(shaadiId),
      userId: new Types.ObjectId(currentUserId),
      blocked: false
    });

    if (!userMembership) {
      throw new BadRequestException('You are not a member of this shaadi');
    }

    // Get all non-blocked members
    const members = await this.shaadiMemberModel.find({
      shaadiId: new Types.ObjectId(shaadiId),
      blocked: false
    }).select('userId role name profilePic phone email side relationship showContact createdAt updatedAt').lean();

    // Apply privacy rules based on user role
    const isCreator = userMembership.role === UserRole.CREATOR;
    
    const processedMembers = members.map(member => {
      const memberData: any = {
        _id: member._id,
        userId: member.userId,
        role: member.role,
        name: member.name,
        profilePic: member.profilePic,
        email: member.email, // Always visible
        side: member.side,
        relationship: member.relationship,
        createdAt: (member as any).createdAt
      };

      // Phone number visibility rules
      if (isCreator || (member as any).showContact) {
        memberData.phone = member.phone;
      } else {
        memberData.phone = undefined; // Explicitly set to undefined if not visible
      }

      return memberData;
    });

    return {
      members: processedMembers,
      userRole: userMembership.role
    };
  }

  private generateInviteCode(): string {
    // Use a more robust method: timestamp + random
    const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // 2-digit random
    const code = timestamp + random;
    
    if (!code || code.length !== 6) {
      throw new Error('Failed to generate valid invite code');
    }
    return code;
  }
} 