import { Test, TestingModule } from '@nestjs/testing';
import { PeepController } from './peep.controller';
import { PeepService } from './peep.service';
import { PrismaModule } from '../modules/prisma/prisma.module';
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
    const expected = {
      id: 'some-uuid',
      content: 'test content',
      user_id: userId,
      created_at: Date.now(),
    };
    mockPeepService.create = jest.fn().mockReturnValueOnce(expected);

    const testCreatePeepDto: CreatePeepDto = {
      user_id: userId,
      content: 'test content',
    };
    const actual = await controller.create(testCreatePeepDto);

    // Check expectations
    expect(mockPeepService.create).toHaveBeenCalled();
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
    expect(actual.user_id).toBe(userId);
  });

  it('should find peep by id', async () => {
    const userId = 'some-user-uuid';
    const expected = {
      id: 'some-uuid',
      content: 'test content',
      user_id: userId,
      created_at: Date.now().toLocaleString(),
    };

    mockPeepService.findOne = jest.fn().mockReturnValueOnce(expected);

    const actual = await controller.findOne('some-uuid');

    expect(mockPeepService.findOne).toHaveBeenCalled();
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });

  it('should remove peep', async () => {
    const userId = 'some-user-uuid';
    const expected = {
      id: 'some-uuid',
      content: 'test content',
      user_id: userId,
      created_at: Date.now().toLocaleString(),
    };
    mockPeepService.remove = jest.fn().mockReturnValueOnce(expected);

    const actual = await controller.remove('some-uuid');

    expect(mockPeepService.remove).toHaveBeenCalled();
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
});
