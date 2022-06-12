import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number): Promise<User> {
    return id ? this.repo.findOne({where: { id }}) : null;
  }

  findEmails(email: string): Promise<User[]> {
    return this.repo.find({where: { email }});
  }

  async update(id: number, updatedUser: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
    }

    Object.assign(user, updatedUser);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
    }

    return this.repo.remove(user);
  }
}
