import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn().mockImplementation((newUser) => {
              return Promise.resolve({ id: 'id1', ...newUser });
            }),
            // login: jest.fn().mockResolvedValue((newUser) => {
            //   return 1;
            // }),
            // findUserByUsername: jest.fn().mockResolvedValue((newUser) => {
            //   return 1;
            // }),
            // generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
        password: 'admin',
      };
      // Note: on success, the object returned by the service will actually have
      // more fields (created_at, DB-generated id, etc.), but that's fine
      // since toMatchObject() will check that it's an object with the form
      // passed as argument.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expected } = newUser;
      expect(await controller.create(newUser)).toMatchObject(expected);
    });
  });

  describe('login', () => {
    it('should successfully login', async () => {
      const newUser: LoginUserDto = {
        username: 'username1',
        password: 'admin',
      };
      // TODO ...
    });
  });
});
