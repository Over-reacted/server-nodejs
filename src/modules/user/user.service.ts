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

  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
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
