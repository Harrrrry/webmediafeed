import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return `List comments for post ${postId}`;
  }

  @Post('post/:postId')
  create(@Param('postId') postId: string, @Body() createCommentDto: any) {
    return `Add comment to post ${postId}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete comment ${id}`;
  }
} 