import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { PeepModule } from '../peep/peep.module';

@Module({
  imports: [PrismaModule, PeepModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
