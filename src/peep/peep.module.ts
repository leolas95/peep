import { Module } from '@nestjs/common';
import { PeepService } from './peep.service';
import { PeepController } from './peep.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PeepController],
  providers: [PrismaService, PeepService],
})
export class PeepModule {}
