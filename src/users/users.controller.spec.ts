import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number): Promise<User> => {
        return Promise.resolve({
          id,
          email: 'a@u.de',
          password: '123',
        } as User);
      },
      findEmails: (email: string) => {
        return Promise.resolve([{ id: 10, email, password: '123' } as User]);
      },
      // update: (id: number, updatedUser: Partial<User>) => {

      // },
      // remove: (id: number) => {

      // }
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const user = await controller.findAllEmails('a@u.de');
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('a@u.de');
  });

  it('findOneUser should find a user successfully.', async () => {
    const user = await controller.findOneUser('10');
    expect(user).toBeDefined();
  });

  it('singin should return user and update the session.', async () => {
    const session = { userId: -100 };
    const user = await controller.signin(
      { email: 'a@u.de', password: '123' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
