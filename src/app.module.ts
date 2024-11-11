import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeepModule } from './peep/peep.module';

@Module({
  imports: [PeepModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
