import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShaadiController } from './shaadi.controller';
import { ShaadiService } from './shaadi.service';
import { Shaadi, ShaadiSchema } from './shaadi.schema';
import { ShaadiMember, ShaadiMemberSchema } from './shaadi-member.schema';
import { Invite, InviteSchema } from './invite.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shaadi.name, schema: ShaadiSchema },
      { name: ShaadiMember.name, schema: ShaadiMemberSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ShaadiController],
  providers: [ShaadiService],
  exports: [ShaadiService],
})
export class ShaadiModule {} 