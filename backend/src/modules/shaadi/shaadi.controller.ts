import { Controller, Post, Body, UseGuards, Req, UploadedFile, UseInterceptors, Get, Patch, Delete, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShaadiService } from './shaadi.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('shaadi')
export class ShaadiController {
  constructor(private readonly shaadiService: ShaadiService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/shaadi',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async createShaadi(
    @Body() body: {
      name: string;
      brideName: string;
      groomName: string;
      date: string;
      location?: string;
    },
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const imageUrl = file ? `/uploads/shaadi/${file.filename}` : undefined;
    
    return this.shaadiService.createShaadi({
      ...body,
      date: new Date(body.date),
      image: imageUrl,
      createdBy: userId
    });
  }

  @Post('invite')
  async generateInvite(@Body() body: {
    shaadiId: string;
    guestEmail: string;
    createdBy: string;
    expiresInHours?: number;
    otp?: string;
  }) {
    return this.shaadiService.generateInvite(body);
  }

  @Post('invite/redeem')
  async redeemInvite(@Body() body: {
    code: string;
    guestEmail: string;
    userId: string;
    otp?: string;
  }) {
    return this.shaadiService.redeemInvite(body);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserShaadis(@Req() req: Request) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.getUserShaadis(userId);
  }

  @Post('switch')
  @UseGuards(JwtAuthGuard)
  async switchShaadi(
    @Body() body: { code: string },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    if (!body.code) {
      throw new Error('6-digit code is required');
    }
    return this.shaadiService.verifyShaadiCode(userId, body.code);
  }

  @Patch('block-member')
  @UseGuards(JwtAuthGuard)
  async blockMember(
    @Body() body: { shaadiId: string; memberUserId: string },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const creatorId = req.user?.userId;
    if (!creatorId) {
      throw new Error('User not authenticated');
    }
    if (!body.shaadiId || !body.memberUserId) {
      throw new Error('shaadiId and memberUserId are required');
    }
    return this.shaadiService.blockMember(creatorId, body.shaadiId, body.memberUserId);
  }

  @Patch('unblock-member')
  @UseGuards(JwtAuthGuard)
  async unblockMember(
    @Body() body: { shaadiId: string; memberUserId: string },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const creatorId = req.user?.userId;
    if (!creatorId) {
      throw new Error('User not authenticated');
    }
    if (!body.shaadiId || !body.memberUserId) {
      throw new Error('shaadiId and memberUserId are required');
    }
    return this.shaadiService.unblockMember(creatorId, body.shaadiId, body.memberUserId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteShaadi(
    @Param('id') id: string, 
    @Body() body: { reason?: string },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.deleteShaadi(id, userId, body.reason);
  }

  // Invitation Management Endpoints
  @Post(':id/invites')
  @UseGuards(JwtAuthGuard)
  async createInvite(
    @Param('id') shaadiId: string,
    @Body() inviteData: {
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      relationship: string;
      side: 'groom' | 'bride';
      message?: string;
    },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.createInvite(shaadiId, userId, inviteData);
  }

  @Get(':id/invites')
  @UseGuards(JwtAuthGuard)
  async getInvites(
    @Param('id') shaadiId: string,
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.getInvites(shaadiId, userId);
  }

  @Put(':id/invites/:inviteId')
  @UseGuards(JwtAuthGuard)
  async updateInviteStatus(
    @Param('id') shaadiId: string,
    @Param('inviteId') inviteId: string,
    @Body() body: { status: string; userId?: string },
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.updateInviteStatus(inviteId, body.status, body.userId);
  }

  @Delete(':id/invites/:inviteId')
  @UseGuards(JwtAuthGuard)
  async deleteInvite(
    @Param('id') shaadiId: string,
    @Param('inviteId') inviteId: string,
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.deleteInvite(inviteId, userId);
  }

  @Post(':id/invites/:inviteId/resend')
  @UseGuards(JwtAuthGuard)
  async resendInvite(
    @Param('id') shaadiId: string,
    @Param('inviteId') inviteId: string,
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.resendInvite(inviteId, userId);
  }

  @Post('track/open')
  async trackInviteOpen(@Body() body: { code: string }) {
    return this.shaadiService.trackInviteOpen(body.code);
  }

  @Post('track/click')
  async trackInviteClick(@Body() body: { code: string }) {
    return this.shaadiService.trackInviteClick(body.code);
  }

  @Get(':id/guest-stats')
  @UseGuards(JwtAuthGuard)
  async getGuestStats(
    @Param('id') shaadiId: string,
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.getGuestStats(shaadiId);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getShaadiMembers(
    @Param('id') shaadiId: string,
    @Req() req: Request
  ) {
    // @ts-ignore - user is added by auth guard
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.shaadiService.getShaadiMembers(shaadiId, userId);
  }
} 