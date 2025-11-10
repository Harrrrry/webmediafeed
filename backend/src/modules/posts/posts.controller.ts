import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('shaadiId') shaadiId: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    if (!shaadiId) throw new Error('shaadiId is required');
    return this.postsService.findAll(shaadiId, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('shaadiId') shaadiId: string) {
    if (!shaadiId) throw new Error('shaadiId is required');
    return this.postsService.findOne(id, shaadiId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: { shaadiId: string; mediaUrls: string[]; mediaTypes: string[]; caption?: string; tags?: string[] }, @Req() req: Request) {
    if (!dto.shaadiId) throw new Error('shaadiId is required');
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.create({ ...dto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { shaadiId: string; caption?: string }, @Req() req: Request) {
    if (!dto.shaadiId) throw new Error('shaadiId is required');
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.update(id, userId, dto.shaadiId, { caption: dto.caption });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body() dto: { shaadiId: string }, @Req() req: Request) {
    if (!dto.shaadiId) throw new Error('shaadiId is required');
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.remove(id, userId, dto.shaadiId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Body() dto: { shaadiId: string }, @Req() req: Request) {
    if (!dto.shaadiId) throw new Error('shaadiId is required');
    // @ts-ignore
    const userId = req.user.userId;
    return this.postsService.like(id, userId, dto.shaadiId);
  }
} 