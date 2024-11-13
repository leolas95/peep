import { Module } from '@nestjs/common';
import { PeepService } from './peep.service';
import { PeepController } from './peep.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PeepController],
  providers: [PeepService],
})
export class PeepModule {}
