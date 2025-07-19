import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: { mediaUrl: string; mediaType: string; caption?: string }, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.create({ ...dto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { caption?: string }, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.like(id, userId);
  }
} 