import { createHmac } from 'crypto';
import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerEntity } from './customer.entity';
import { UserStatus } from 'common/user-status';
import { UpdateCustomerPayload } from './payloads/update-customer.payload';

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

  async update(id: number, payload: UpdateCustomerPayload) {
    return await this.customerRepository.save({
      id: id,
      name: payload.name,
      description: payload.description,
      location: payload.location,
      phone: payload.phoneNumber
    });
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const passHash = createHmac('sha256', currentPassword).digest('hex');
    const customer = await this.customerRepository
      .createQueryBuilder('customers')
      .where('customers.id = :id and customers.password = :password')
      .setParameter('id', id)
      .setParameter('password', passHash)
      .getOne();

    if (!customer) {
      throw new BadRequestException('Provided password was not correct');
    }
    await this.resetPassword(id, newPassword);
  }
}