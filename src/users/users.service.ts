import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {

  }

  async find(id: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({id: id})
  }

  async findByEmail(email: string): Promise<User | null>
  {
    return this.usersRepository.findOneBy({email});
  }

  async create(input: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(input.password, salt);
    const user = this.usersRepository.create({...input, id: randomUUID(), salt, password});
    await this.usersRepository.insert(user).catch(() => {
      throw new BadRequestException('The user already exists');
    });

    return user;
  }
}
