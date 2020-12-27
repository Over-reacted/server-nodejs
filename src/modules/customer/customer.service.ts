import { createHmac } from 'crypto';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer, CustomerEntity } from './customer.entity';
import { UserStatus } from 'common/user-status';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async get(id: number) {
    return await this.customerRepository.findOne(id);
  }

  async getByEmailAndPass(email: string, password: string) {
    const passHash = createHmac('sha256', password).digest('hex');
    return await this.customerRepository
      .createQueryBuilder('customers')
      .where('customers.email = :email and customers.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async getByEmail(email: string) {
    return await this.customerRepository
      .createQueryBuilder('customers')
      .where('customers.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: CustomerEntity) {
    const customer = await this.getByEmail(payload.email);

    if (customer) {
      throw new NotAcceptableException(
        'Customer with provided email is already created.',
      );
    }
    return await this.customerRepository.save(this.customerRepository.create(payload));
  }

  async isEmailConfirmed(customer: Customer) {
    return customer?.emailStatus === UserStatus.ACTIVE;
  }

  async changeEmailStatus(id: number, emailStatus: UserStatus = UserStatus.ACTIVE) {
    return this.customerRepository.save({
      id: id,
      emailStatus: emailStatus
    });
  }

  async resetPassword(id: number, password: string) {
    return await this.customerRepository.save({
      id: id,
      password: password
    });
  }
}