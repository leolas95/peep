import { Module } from '@nestjs/common';
import { PeepService } from './peep.service';
import { PeepController } from './peep.controller';

@Module({
  controllers: [PeepController],
  providers: [PeepService],
})
export class PeepModule {}
