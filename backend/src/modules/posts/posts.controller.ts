import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return 'List all posts';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Get post ${id}`;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: any) {
    return 'Create post';
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: any) {
    return `Update post ${id}`;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete post ${id}`;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string) {
    return `Like/unlike post ${id}`;
  }
} 