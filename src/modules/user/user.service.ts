import  crypto from 'crypto';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserFillableFields } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByEmailAndPass(email: string, password: string) {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async create(payload: UserFillableFields) {
    const id = 1;
    // Id is 1 for mocking purpose, we should decrypt the JWT somewhere along the chain
    // and pass the id here
    const user = await this.userRepository.findOne(id);

    if (user) {
      throw new NotAcceptableException('You only live once');
    }

    return await this.userRepository.save(this.userRepository.create(payload));
  }
}
