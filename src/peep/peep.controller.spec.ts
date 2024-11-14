import { Test, TestingModule } from '@nestjs/testing';
import { PeepController } from './peep.controller';
import { PeepService } from './peep.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CreatePeepDto } from './dto/create-peep.dto';

describe('PeepController', () => {
  let controller: PeepController;

  const mockPeepService = {
    create: jest.fn,
    findAllUserPeeps: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PeepController],
      providers: [
        {
          provide: PeepService,
          useValue: mockPeepService,
        },
      ],
    }).compile();

    controller = module.get<PeepController>(PeepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create peep', async () => {
    // Arrange test data and mocked methods
    const userId = 'some-user-uuid';
    const mockCreatePeep = {
      id: 'some-uuid',
      content: 'test content',
      user_id: userId,
      created_at: Date.now(),
    };
    mockPeepService.create = jest.fn().mockReturnValueOnce(mockCreatePeep);

    const testCreatePeepDto: CreatePeepDto = {
      user_id: userId,
      content: 'test content',
    };
    const createdPeep = await controller.create(testCreatePeepDto);

    // Check expectations
    expect(mockPeepService.create).toHaveBeenCalled();
    expect(createdPeep).toBeDefined();
    expect(createdPeep.user_id).toBe(userId);
  });
});
