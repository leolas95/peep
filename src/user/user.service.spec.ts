import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { PeepModule } from '../peep/peep.module';
import { PrismaService } from '../modules/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUsers = [
  {
    id: 'id1',
    name: 'user1',
    email: 'one@email.com',
    username: 'user1',
    peeps: [],
    createdAt: new Date(),
    password: 'password1',
  },
  {
    id: 'id2',
    name: 'user2',
    email: 'two@email.com',
    username: 'user2',
    peeps: [],
    createdAt: new Date(),
    password: 'password2',
  },
  {
    id: 'id3',
    name: 'user3',
    email: 'three@email.com',
    username: 'user3',
    peeps: [],
    createdAt: new Date(),
    password: 'password3',
  },
];

const mockFollows = [
  { follower_id: 'id1', followee_id: 'id2' },
  { follower_id: 'id2', followee_id: 'id3' },
];

const firstUser = mockUsers[0];
const firstFollow = mockFollows[0];

const mockDB = {
  user: {
    create: jest.fn().mockResolvedValue(firstUser),
    delete: jest.fn().mockResolvedValue(firstUser),
    findUnique: jest.fn().mockResolvedValue(firstUser),
    findFirst: jest.fn().mockResolvedValue(firstUser),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  follows: {
    create: jest.fn().mockResolvedValue(firstFollow),
    delete: jest.fn().mockResolvedValue(firstFollow),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, PeepModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findById', () => {
    it('should return user', async () => {
      expect(await service.findById('id1')).toBeDefined();
      expect(mockDB.user.findUnique).toHaveBeenCalled();
    });

    it('should return null for non existing user', async () => {
      mockDB.user.findUnique.mockResolvedValueOnce(null);
      expect(await service.findById('fake-id')).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return user', async () => {
      expect(await service.findByUsername('id1')).toBeDefined();
      expect(mockDB.user.findFirst).toHaveBeenCalled();
    });

    it('should return null for non existing username', async () => {
      mockDB.user.findFirst.mockResolvedValueOnce(null);
      expect(await service.findByUsername('id1')).toBeNull();
      expect(mockDB.user.findFirst).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const result = await service.update(
        'id1',
        new UpdateUserDto({ email: 'new-email@email.com' }),
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result.count).toEqual(1);
      expect(mockDB.user.updateMany).toHaveBeenCalled();
    });

    it('should return error when updating non existing user', async () => {
      mockDB.user.updateMany.mockResolvedValueOnce({ count: 0 });
      const result = await service.update(
        'fake-id',
        new UpdateUserDto({ email: 'new-email@email.com' }),
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result.count).toEqual(0);
      expect(mockDB.user.updateMany).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await service.remove('id1');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result.count).toEqual(1);
      expect(mockDB.user.deleteMany).toHaveBeenCalled();
    });

    it('should return error when deleting non existing user', async () => {
      mockDB.user.deleteMany.mockResolvedValueOnce({ count: 0 });
      const result = await service.remove('fake-id');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('count');
      expect(result.count).toEqual(0);
      expect(mockDB.user.deleteMany).toHaveBeenCalled();
    });
  });
});
