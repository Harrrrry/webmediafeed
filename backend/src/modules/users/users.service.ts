import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.userModel.findOne({ $or: [{ username }, { email }] });
    if (existing) throw new ConflictException('Username or email already exists');
    const passwordHash = await this.authService.hashPassword(password);
    const user = await this.userModel.create({ username, email, passwordHash });
    return { id: user._id, username: user.username, email: user.email };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await this.authService.comparePasswords(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.authService.generateJwt({ sub: user._id, username: user.username });
    return { access_token: token };
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
} 