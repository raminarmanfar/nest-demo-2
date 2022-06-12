import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findEmails: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {id: Math.floor(Math.random() * 9999), email, password} as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup hashes the password', async () => {
    const user = await service.signup('ali@vali.de', '123');
    expect(user.password).not.toEqual('123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('singup unsuccessful because the email is in use', async () => {
    await service.signup('ali@vali.de', '1000');
    await expect(service.signup('ali@vali.de', '123')).rejects.toThrowError(BadRequestException);
  });

  it('signin fails since the given email is not exists', async () => {
    await expect(service.signin('ali@vali.de', '123')).rejects.toThrowError(NotFoundException);
  });

  it('signin fails since invalid password provided', async () => {
    await service.signup('ali@vali.de', '12345');
    await expect(service.signin('ali@vali.de', '123')).rejects.toThrowError(BadRequestException);
  });

  it('signin should be successful', async () => {
    await service.signup('ramin@uaa.de', '123');
    const user = await service.signin('ramin@uaa.de', '123');
    expect(user).toBeDefined();
  });
});
