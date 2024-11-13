import { Test, TestingModule } from '@nestjs/testing';
import { PeepService } from './peep.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('PeepService', () => {
  let service: PeepService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PeepService],
    }).compile();

    service = module.get<PeepService>(PeepService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('prisma service should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should create peep', async () => {
    const db = [
      {
        id: 'some-uuid',
        content: 'existing peep',
        user_id: 'some-uuid',
        created_at: Date.now(),
      },
    ];

    prismaService.peep.create = jest
      .fn()
      .mockImplementationOnce(function (createPeepDto) {
        createPeepDto.data.id = 'some-generated-uuid';
        createPeepDto.data.created_at = Date.now();
        db.push(createPeepDto.data);

        return createPeepDto.data;
      });

    const peep = await service.create({
      user_id: 'some-user-id',
      content: 'some content',
    });

    expect(db.length).toBe(2);
    expect(prismaService.peep.create).toHaveBeenCalled();

    const last = db.pop();
    expect(last).toBe(peep);
  });

  it('should get peep by id', async () => {
    const mockPeep = {
      id: 'some-uuid',
      content: 'test content',
      user_id: 'some-uuid',
      created_at: Date.now().toLocaleString(),
    };
    prismaService.peep.findUnique = jest.fn().mockResolvedValueOnce(mockPeep);

    const peep = await service.findOne('some-uuid');
    expect(prismaService.peep.findUnique).toHaveBeenCalled();
    expect(peep).toEqual(mockPeep);
  });

  it('should find all peeps by a user', async () => {
    const userId = 'some-user-id';
    const db = [
      {
        id: 'some-peep-uuid',
        content: 'existing peep 1',
        user_id: userId,
        created_at: Date.now(),
      },
      {
        id: 'some-peep-uuid',
        content: 'existing peep 2',
        user_id: userId,
        created_at: Date.now(),
      },
      {
        id: 'some-uuid',
        content: 'existing peep 3',
        user_id: 'another-user-uuid',
        created_at: Date.now(),
      },
      {
        id: 'some-uuid',
        content: 'existing peep 4',
        user_id: userId,
        created_at: Date.now(),
      },
    ];

    prismaService.peep.findMany = jest.fn().mockImplementationOnce(function ({
      where: { user_id },
    }) {
      const result = [];
      for (const peep of db) {
        if (peep.user_id === user_id) {
          result.push(peep);
        }
      }
      return result;
    });

    const peeps = await service.findAllUserPeeps(userId);

    expect(peeps.length).toBe(3);
    expect(prismaService.peep.findMany).toHaveBeenCalled();
  });

  it('should remove peep by id', async () => {
    const peepId = 'some-peep-id';
    const db = [
      {
        id: peepId,
        content: 'existing peep 1',
        user_id: 'some-user-id',
        created_at: Date.now(),
      },
      {
        id: 'some-uuid',
        content: 'existing peep 2',
        user_id: 'some-user-id',
        created_at: Date.now(),
      },
    ];

    prismaService.peep.delete = jest.fn().mockImplementationOnce(function ({
      where: { id },
    }) {
      let peep;
      for (let i = 0; i < db.length; i++) {
        peep = db[i];
        if (peep.id === id) {
          db.splice(i, 1);
          return peep;
        }
      }
    });

    const removedPeep = await service.remove(peepId);

    expect(db.length).toBe(1);
    expect(prismaService.peep.delete).toHaveBeenCalled();
    expect(removedPeep).toBeDefined();
    expect(removedPeep.id).toBe(peepId);
  });
});
