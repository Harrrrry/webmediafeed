import { Controller, Post, Body, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('register')
  register(@Body() registerDto: any) {
    return 'Register user';
  }

  @Post('login')
  login(@Body() loginDto: any) {
    return 'User login';
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return `Get user profile ${id}`;
  }
} 