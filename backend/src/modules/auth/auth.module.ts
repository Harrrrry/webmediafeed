import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ShaadiMember, ShaadiMemberSchema } from '../shaadi/shaadi-member.schema';
import { Invite, InviteSchema } from '../shaadi/invite.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      { name: ShaadiMember.name, schema: ShaadiMemberSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
