import { Controller, Post, Body, Get, Param, Req, UseGuards, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

class RegisterDto {
  username: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicUrl?: string;
}

class LoginDto {
  username: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(
      dto.username,
      dto.email,
      dto.password,
      dto.phone,
      dto.gender,
      dto.profilePicUrl
    );
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto.username, dto.password);
  }

  @Post('login-shaadi')
  async loginWithShaadiCode(@Body() dto: { code: string }) {
    try {
      if (!dto.code || dto.code.length !== 6) {
        throw new Error('6-digit code is required');
      }
      return await this.authService.loginWithShaadiCode(dto.code);
    } catch (error) {
      if (error.message === 'Invalid code or access denied') {
        throw new Error('Invalid Shaadi code. Please check your code and try again.');
      }
      throw error;
    }
  }

  @Post('join-shaadi')
  async joinShaadi(@Body() dto: {
    code: string;
    name: string;
    side: string;
    relationship: string;
    contactNumber?: string;
    showContact: boolean;
  }) {
    try {
      if (!dto.code || dto.code.length !== 6) {
        throw new Error('6-digit code is required');
      }
      if (!dto.name || !dto.side || !dto.relationship) {
        throw new Error('Name, side, and relationship are required');
      }
      return await this.usersService.joinShaadi(dto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.usersService.getProfile(userId);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    if (!username) return { available: false };
    const exists = await this.usersService.usernameExists(username);
    return { available: !exists };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    if (!email) return { available: false };
    const exists = await this.usersService.emailExists(email);
    return { available: !exists };
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profileImage',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    // Return the local file URL
    return { url: `/uploads/profileImage/${file.filename}` };
  }
} 