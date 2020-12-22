import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from './../config';
import { Customer, CustomerModule, CustomersService } from '../customer';
import { LoginPayload } from './payloads/login.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
  ) {}

  async createToken(customer: Customer) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: customer.id })
    };
  }

  async validateCustomer(payload: LoginPayload): Promise<any> {
    const customer = await this.customersService.getByEmailAndPass(
      payload.email,
      payload.password,
    );
    if (!customer) {
      throw new UnauthorizedException('Wrong login combination!');
    }
    return customer;
  }
}
