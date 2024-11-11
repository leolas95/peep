import { Test, TestingModule } from '@nestjs/testing';
import { PeepController } from './peep.controller';
import { PeepService } from './peep.service';

describe('PeepController', () => {
  let controller: PeepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeepController],
      providers: [PeepService],
    }).compile();

    controller = module.get<PeepController>(PeepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
