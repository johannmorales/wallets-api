import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createWithPlainPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const hashed = await bcrypt.hash(
      password,
      Number.parseInt(process.env.BCRYPT_SALT_ROUNDS!),
    );
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const user = this.usersRepository.create({ email, password: hashed });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
}
