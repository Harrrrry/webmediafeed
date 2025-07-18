import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';

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

  @Post()
  create(@Body() createPostDto: any) {
    return 'Create post';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: any) {
    return `Update post ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete post ${id}`;
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return `Like/unlike post ${id}`;
  }
} 