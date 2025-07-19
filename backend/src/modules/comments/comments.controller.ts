import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return `List comments for post ${postId}`;
  }

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  create(@Param('postId') postId: string, @Body() createCommentDto: any) {
    return `Add comment to post ${postId}`;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete comment ${id}`;
  }
} 