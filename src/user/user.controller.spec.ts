import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PeepModule } from '../peep/peep.module';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, PeepModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockImplementation((newUser) => {
              return Promise.resolve({ id: 'id1', ...newUser });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create user', async () => {
      const newUser: CreateUserDto = {
        name: 'new user',
        email: 'user@email.com',
        username: 'user1',
        password: 'user123',
      };
      // Note: on success, the object returned by the service will actually have
      // more fields (created_at, DB-generated id, etc.), but that's fine
      // since toMatchObject() will check that it's an object with the form
      // passed as argument.
      await expect(controller.create(newUser)).resolves.toMatchObject(newUser);
    });
  });
});
