import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeepModule } from './peep/peep.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PeepModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
