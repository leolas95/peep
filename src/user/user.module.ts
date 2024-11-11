import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PeepService } from '../peep/peep.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, PeepService, UserService],
})
export class UserModule {}
