import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string): Promise<User> {
        // 1- see if email is already in use.
        const users = await this.usersService.findEmails(email);
        if (users.length) {
            throw new BadRequestException(`email address ${email} is already in use`);
        }

        // 2- hash the user's password.
        // 2.1- generate a salt.
        const salt = randomBytes(8).toString('hex');
        // 2.2- hash the password & salt together.
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');

        // 3- create a new user and save it then return it.
        return await this.usersService.create(email, result);
    }

    async signin(email: string, password: string): Promise<User> {
        const [user] = await this.usersService.findEmails(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        return user;
    }
}
