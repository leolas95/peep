import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeepModule } from './peep/peep.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PeepModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
