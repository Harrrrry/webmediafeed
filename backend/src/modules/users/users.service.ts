import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { AuthService } from '../auth/auth.service';
import { Invite, InviteDocument } from '../shaadi/invite.schema';
import { ShaadiMember, ShaadiMemberDocument } from '../shaadi/shaadi-member.schema';
import { UserRole } from '../../common/constants/roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    @InjectModel(ShaadiMember.name) private shaadiMemberModel: Model<ShaadiMemberDocument>,
    private readonly authService: AuthService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
    phone?: string,
    gender?: 'male' | 'female' | 'other',
    profilePicUrl?: string
  ) {
    const existing = await this.userModel.findOne({ $or: [{ username }, { email }] });
    if (existing) throw new ConflictException('Username or email already exists');
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      throw new BadRequestException('Gender must be male, female, or other');
    }
    const passwordHash = await this.authService.hashPassword(password);
    try {
      const user = await this.userModel.create({
        username,
        email,
        passwordHash,
        phone,
        gender,
        profilePicUrl,
      });
      return { id: user._id, username: user.username, email: user.email };
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await this.authService.comparePasswords(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.authService.generateJwt({ sub: String(user._id), username: user.username });
    return { access_token: token };
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async usernameExists(username: string): Promise<boolean> {
    return !!(await this.userModel.exists({ username }));
  }

  async emailExists(email: string): Promise<boolean> {
    return !!(await this.userModel.exists({ email }));
  }

  async joinShaadi(joinData: {
    code: string;
    name: string;
    side: string;
    relationship: string;
    contactNumber?: string;
    showContact: boolean;
  }) {
    try {
      // Find the invite with the given code
      const invite = await this.inviteModel.findOne({
        inviteCode: joinData.code,
        status: { $in: ['pending', 'sent'] }
      }).populate('shaadiId').populate('createdBy');

      if (!invite) {
        throw new BadRequestException('Invalid invite code or invite has already been used');
      }

      // Create or find guest user
      let guestUser = await this.userModel.findOne({
        $or: [
          { email: joinData.contactNumber }, // Using contactNumber as email for now
          { phone: joinData.contactNumber }
        ]
      });

      if (!guestUser) {
        // Create new guest user
        const username = `guest_${Date.now()}`;
        const email = joinData.contactNumber || `${username}@guest.com`;
        
        guestUser = await this.userModel.create({
          username,
          email,
          passwordHash: await this.authService.hashPassword('guest_' + Math.random().toString(36).substr(2, 9)),
          phone: joinData.contactNumber,
          profilePicUrl: null,
        });
      }

      // Find the creator's ShaadiMember record to get invitedBy reference
      const creatorMember = await this.shaadiMemberModel.findOne({
        shaadiId: invite.shaadiId,
        userId: invite.createdBy,
        role: UserRole.CREATOR
      });

      // Use the invite's existing code for the guest (maintains consistency from invite to membership)
      const guestCode = invite.inviteCode;
      
      // Check if this code is already used in ShaadiMember (shouldn't happen, but safety check)
      const existingMember = await this.shaadiMemberModel.findOne({ code: guestCode });
      if (existingMember) {
        throw new BadRequestException('This invite code has already been used by another member');
      }

      // Create ShaadiMember record for the guest
      const shaadiMember = await this.shaadiMemberModel.create({
        shaadiId: invite.shaadiId,
        userId: guestUser._id,
        role: UserRole.GUEST,
        code: guestCode,
        blocked: false,
        // Guest-specific fields
        name: joinData.name,
        phone: joinData.contactNumber,
        email: guestUser.email,
        profilePic: null, // Will be updated later through the application
        side: joinData.side,
        relationship: joinData.relationship,
        showContact: joinData.showContact,
        invitedBy: creatorMember?._id, // Reference to creator's ShaadiMember ID
      });

      // Update the invite with guest details and mark as joined
      await this.inviteModel.findByIdAndUpdate(invite._id, {
        status: 'joined',
        guestName: joinData.name,
        guestEmail: guestUser.email,
        guestPhone: joinData.contactNumber,
        relationship: joinData.relationship,
        side: joinData.side,
        guestUserId: guestUser._id,
        joinedAt: new Date(),
        showContact: joinData.showContact,
      });

      // Delete the invite record after successful join
      await this.inviteModel.findByIdAndDelete(invite._id);

      // Generate JWT token for the guest
      const token = await this.authService.generateJwt({
        sub: String(guestUser._id),
        userId: String(guestUser._id),
        type: 'user_access'
      });

      return {
        success: true,
        access_token: token,
        user: {
          id: guestUser._id,
          username: guestUser.username,
          email: guestUser.email,
        },
        shaadi: invite.shaadiId,
        shaadiMember: shaadiMember,
        message: 'Successfully joined the wedding celebration'
      };
    } catch (error) {
      console.error('JoinShaadi error:', error);
      throw error;
    }
  }
} 