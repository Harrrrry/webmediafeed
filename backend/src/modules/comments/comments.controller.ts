import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  create(
    @Param('postId') postId: string,
    @Body() dto: { text: string },
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.commentsService.create(postId, userId, dto.text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.commentsService.remove(id, userId);
  }
} 