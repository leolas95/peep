import { Test, TestingModule } from '@nestjs/testing';
import { PeepService } from './peep.service';
import { PrismaService } from '../modules/prisma/prisma.service';
import { ImATeapotException } from '@nestjs/common';

const mockPeeps = [
  {
    id: 'peep_id1',
    content: 'some content',
    user_id: 'user_id1',
    created_at: new Date(),
  },
  {
    id: 'peep_id2',
    content: 'some content',
    user_id: 'user_id2',
    created_at: new Date(),
  },
  {
    id: 'peep_id3',
    content: 'some content',
    user_id: 'user_id1',
    created_at: new Date(),
  },
];

const mockUserLikes = [
  {
    id: 'id1',
    user_id: 'user_id1',
    peep_id: 'peep_id1',
    created_at: new Date(),
  },
];

const mockLikes = [
  {
    id: 'id1',
    peep_id: 'peep_id1',
    like_count: 1,
    created_at: new Date(),
  },
];

describe('PeepService', () => {
  let service: PeepService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PeepService,
        {
          provide: PrismaService,
          useValue: {
            peep: {
              create: jest.fn().mockImplementation(({ data: peep_data }) => {
                return {
                  id: 'some-generated-uuid',
                  created_at: new Date(),
                  ...peep_data,
                };
              }),
              findMany: jest.fn().mockResolvedValue(mockPeeps),
              findUnique: jest.fn().mockResolvedValue(mockPeeps[0]),
              deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            user_likes: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockImplementation((data) => {
                return {
                  id: 'some-generated-uuid',
                  created_at: new Date(),
                  ...data,
                };
              }),
              deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            likes: {
              upsert: jest.fn().mockImplementation(() => {
                return {
                  id: 'some-generated-uuid',
                  created_at: new Date(),
                  peep_id: 'peep_id1',
                  like_count: 2,
                };
              }),
              update: jest.fn().mockResolvedValue({
                ...mockLikes[0],
                like_count: 0,
              }),
            },
          },
        },
      ],
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
    const newPeep = {
      user_id: 'some-user-id',
      content: 'some content',
    };
    const peep = await service.create(newPeep);

    expect(peep).toBeDefined();
    expect(peep).toMatchObject(newPeep);
    expect(prismaService.peep.create).toHaveBeenCalled();
  });

  it('should get peep by id', async () => {
    const peep = await service.findOne('id1');
    expect(peep).toBeDefined();
    expect(prismaService.peep.findUnique).toHaveBeenCalled();
  });

  it('should find all peeps by a user', async () => {
    const userId = 'user_id1';

    prismaService.peep.findMany = jest
      .fn()
      .mockImplementationOnce(({ where: { user_id } }) => {
        const result = [];
        for (const peep of mockPeeps) {
          if (peep.user_id === user_id) {
            result.push(peep);
          }
        }
        return result;
      });

    const peeps = await service.findAllUserPeeps(userId);

    expect(peeps.length).toEqual(2);
    expect(prismaService.peep.findMany).toHaveBeenCalled();
  });

  it('should remove peep by id', async () => {
    const removedCount = await service.remove('peep_id1');

    expect(removedCount).toBeDefined();
    expect(prismaService.peep.deleteMany).toHaveBeenCalled();
    expect(removedCount).toHaveProperty('count');
    expect(removedCount.count).toBe(1);
  });

  describe('like', () => {
    it('should like peep', async () => {
      const like = await service.like('peep_id1', 'user_id1');

      expect(like).toBeDefined();
      expect(like).toHaveProperty('like_count');
      expect(like.like_count).toEqual(2);
    });

    it('should not like peep if already liked', async () => {
      prismaService.user_likes.findUnique = jest
        .fn()
        .mockImplementationOnce(() => {
          return mockUserLikes[0];
        });

      await expect(service.like('peep_id1', 'user_id1')).rejects.toThrowError(
        ImATeapotException,
      );
    });

    it('should return error if could not create user_like', async () => {
      prismaService.user_likes.create = jest.fn().mockImplementationOnce(() => {
        throw new ImATeapotException();
      });

      await expect(service.like('peep_id1', 'user_id1')).rejects.toThrowError(
        ImATeapotException,
      );
    });
  });

  describe('unlike', () => {
    it('should unlike peep', async () => {
      const like = await service.unlike('peep_id1', 'user_id1');

      expect(like).toBeDefined();
      expect(like).toHaveProperty('like_count');
      expect(like.like_count).toEqual(0);
    });

    it('should return error if could not delete user_like', async () => {
      prismaService.user_likes.deleteMany = jest
        .fn()
        .mockResolvedValueOnce({ count: 0 });

      await expect(service.unlike('peep_id1', 'user_id1')).rejects.toThrowError(
        ImATeapotException,
      );
    });
  });

  describe('repeep', () => {
    it('should repeep a peep', async () => {
      const repeep = await service.repeep('peep_id1', 'user_id2');

      expect(repeep).toBeDefined();
      expect(repeep).toHaveProperty('user_id');
      expect(repeep.user_id).toEqual('user_id2');
      expect(prismaService.peep.findUnique).toHaveBeenCalled();
    });

    it('should return error if original peep does not exist', () => {});
  });
});
