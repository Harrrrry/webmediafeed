import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShaadiMember, ShaadiMemberDocument } from '../shaadi/shaadi-member.schema';
import { Invite, InviteDocument } from '../shaadi/invite.schema';
import { User, UserDocument } from '../users/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(ShaadiMember.name) private readonly shaadiMemberModel: Model<ShaadiMemberDocument>,
    @InjectModel(Invite.name) private readonly inviteModel: Model<InviteDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }

  async generateJwt(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async loginWithShaadiCode(code: string): Promise<any> {
    // First, check if this is an invite code (pending/sent or already joined)
    const invite = await this.inviteModel.findOne({
      inviteCode: code,
      status: { $in: ['pending', 'sent', 'joined'] } // Include joined status
    }).populate({
      path: 'shaadiId',
      model: 'Shaadi'
    }).populate({
      path: 'createdBy',
      model: 'User'
    }).populate({
      path: 'guestUserId',
      model: 'User'
    }).exec();

    if (invite) {
      // This is an invite code
      if (!invite.shaadiId) {
        throw new Error('Invalid Shaadi data');
      }

      // If invite is already joined, use the guest user from ShaadiMember
      if (invite.status === 'joined' && invite.guestUserId) {
        // Find the guest's ShaadiMember record to get their data
        const guestMembership = await this.shaadiMemberModel.findOne({
          shaadiId: invite.shaadiId,
          userId: invite.guestUserId,
          role: 'guest'
        });

        if (!guestMembership) {
          throw new Error('Guest membership not found');
        }

        // For guests - use ShaadiMember data (guest-specific data)
        const userData = {
          _id: guestMembership.userId,
          username: guestMembership.name, // Guest's actual name
          email: guestMembership.email || `${guestMembership.name}@guest.com`,
          profilePicUrl: guestMembership.profilePic, // Guest's profile pic
          phone: guestMembership.phone,
        };

        const token = await this.generateJwt({
          sub: String(guestMembership.userId),
          userId: String(guestMembership.userId),
          type: 'user_access'
        });

        return {
          access_token: token,
          shaadi: invite.shaadiId,
          role: 'guest',
          user: userData, // Use guest data from ShaadiMember
          isInviteCode: true,
          isJoined: true,
          inviteId: invite._id
        };
      }

      // For pending/sent invites, use the creator's token (temporary guest flow)
      const token = await this.generateJwt({
        sub: (invite.createdBy as any)._id,
        userId: (invite.createdBy as any)._id,
        type: 'user_access'
      });

      return {
        access_token: token,
        shaadi: invite.shaadiId,
        role: 'guest',
        user: invite.createdBy,
        isInviteCode: true,
        isJoined: false,
        inviteId: invite._id
      };
    }

    // If not an invite code, check if it's a member code (for guests who have already joined)
    const membership = await this.shaadiMemberModel.findOne({
      code,
      blocked: false
    }).populate({
      path: 'shaadiId',
      model: 'Shaadi'
    }).exec();

    if (!membership) {
      throw new Error('Invalid code or access denied');
    }

    if (!membership.shaadiId || !membership.userId) {
      throw new Error('Invalid Shaadi or user data');
    }

    let userData;

    // Different data source based on user role
    if (membership.role === 'creator') {
      // For creators - use User table data (full user profile)
      const creatorUser = await this.userModel.findById(membership.userId);
      if (!creatorUser) {
        throw new Error('Creator user not found');
      }
      userData = creatorUser; // Full user data from User table
    } else {
      // For guests - use ShaadiMember data (guest-specific data)
      userData = {
        _id: membership.userId,
        username: membership.name, // Guest's actual name
        email: membership.email || `${membership.name}@guest.com`,
        profilePicUrl: membership.profilePic, // Guest's profile pic
        phone: membership.phone,
        // Add any other fields needed for frontend
      };
    }

    // Generate a token for the user (not Shaadi-specific)
    const token = await this.generateJwt({
      sub: String(membership.userId),
      userId: String(membership.userId),
      type: 'user_access'
    });

    return {
      access_token: token,
      shaadi: membership.shaadiId,
      role: membership.role,
      user: userData, // Use appropriate data source based on role
      isInviteCode: false, // This is a member code, not invite code
      isJoined: true // Member codes are always for joined users
    };
  }
}
