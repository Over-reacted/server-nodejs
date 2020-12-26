import { BadRequestException, Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from './../config';
import { Customer, CustomerEntity, CustomersService } from '../customer';
import { LoginPayload } from './payloads/login.payload';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenPayload, TokensService } from 'modules/token';
import { ForgotPasswordPayload } from './payloads/forgot-password.payload';
import { ChangePasswordPayload } from './payloads/change-password.payload';

@Injectable()
export class AuthService {

  private readonly appEmail: string;
  private readonly clientAppUrl: string;
 
  constructor(
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly tokenService: TokensService
  ) {
    this.appEmail = this.configService.get('APP_EMAIL'),
    this.clientAppUrl = this.configService.get('APP_URL')
  }

  async getTokenForSignIn(customer: Customer) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: await this.generateToken({customerId: customer.id})
    };
  }

  async register(payload: CustomerEntity) {
    const customer = await this.customersService.create(payload);
    await this.sendConfirmation(customer);
  }

  async validateCustomer(payload: LoginPayload) : Promise<Customer> {
    const customer = await this.customersService.getByEmailAndPass(
      payload.email,
      payload.password,
    );
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer.id);

    if (!isEmailConfirmed) {
      throw new MethodNotAllowedException('Please confirm your email account');
    }
    return customer;
  }

  async forgotPassword(payload: ForgotPasswordPayload) {
    const customer = await this.customersService.getByEmail(payload.email);
    if (!customer) {
        throw new BadRequestException('Invalid email');
    }
    const token = await this.signUser(customer);
    const forgotLink = `${this.clientAppUrl}/auth/resetPassword?token=${token}`;

    await this.mailService.sendMail({
        from: this.appEmail,
        to: customer.email,
        subject: 'Forgot Password',
        html: `
            <h3>Hello!</h3>
            <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
        `,
    });    
  }

  async confirm(token: string) {
    const tokenPayload = await this.verifyToken(token);
    const customer = await this.customersService.get(tokenPayload.customerId);

    await this.tokenService.delete(tokenPayload.customerId, token);

    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer.id);

    if (customer && !isEmailConfirmed) {
        return await this.customersService.setStatusToActive(customer.id);
    }
    throw new BadRequestException('Confirmation error');
  }

  async resetPassword(token: string, payload: ChangePasswordPayload) {
    const tokenPayload = await this.verifyToken(token);
    const customer = await this.customersService.get(tokenPayload.customerId);

    await this.tokenService.delete(tokenPayload.customerId, token);

    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer.id);

    if (customer && isEmailConfirmed) {
        return await this.customersService.resetPassword(customer.id, payload.password)
    }

    throw new BadRequestException('An error occured');
  }

  private async sendConfirmation(customer: Customer) {
    const token = await this.signUser(customer, false);
    const confirmLink = `${this.clientAppUrl}/api/auth/confirm?token=${token}`;

    await this.mailService.sendMail({
        from: this.appEmail,
        to: customer.email,
        subject: 'Verify User',
        html: `
            <h3>Hello!</h3>
            <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
        `,
    });
  }
  
  private async signUser(customer: Customer, statusCheck: boolean = true) {
    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer.id);

    if (statusCheck && (!isEmailConfirmed)) {
        throw new MethodNotAllowedException('Please confirm your email account');
    }

    const payload: TokenPayload = {
        customerId: customer.id,
    };

    const token = await this.generateToken(payload);

    await this.tokenService.create({
      token: token,
      customerId: customer.id,
    });
    
    return token;
  }

  private async generateToken(payload: TokenPayload) {
    return await this.jwtService.signAsync(payload);  
  }

  private async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token) as TokenPayload;
    const tokenExists = await this.tokenService.exists(payload.customerId, token);

    if (tokenExists) {
        return payload;
    }
    throw new UnauthorizedException();
  }
}