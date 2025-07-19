import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

class RegisterDto {
  username: string;
  email: string;
  password: string;
}

class LoginDto {
  username: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto.username, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto.username, dto.password);
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }
} 