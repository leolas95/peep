import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { PeepModule } from '../peep/peep.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, PeepModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
