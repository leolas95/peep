import { Test, TestingModule } from '@nestjs/testing';
import { PeepService } from './peep.service';

describe('PeepService', () => {
  let service: PeepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeepService],
    }).compile();

    service = module.get<PeepService>(PeepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
