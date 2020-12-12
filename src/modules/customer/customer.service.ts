import { createHmac } from 'crypto';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer, CustomerFillableFields } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async get(id: number) {
    return this.customerRepository.findOne(id);
  }

  async getByEmailAndPass(email: string, password: string) {
    const passHash = createHmac('sha256', password).digest('hex');
    return await this.customerRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async getByEmail(email: string) {
    return await this.customerRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: CustomerFillableFields) {
    const customer = await this.getByEmail(payload.email);

    if (customer) {
      throw new NotAcceptableException(
        'Customer with provided email already created.',
      );
    }

    return await this.customerRepository.save(this.customerRepository.create(payload));
  }
}
