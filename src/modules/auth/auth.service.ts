import { BadRequestException, Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from './../config';
import { Customer, CustomerEntity, CustomersService } from '../customer';
import { LoginPayload } from './payloads/login.payload';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenPayload, TokensService } from 'modules/token';
import { ForgotPasswordPayload } from './payloads/forgot-password.payload';
import { UserStatus } from 'shared/user-status';

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
    return customer;
  }

  async forgotPassword(payload: ForgotPasswordPayload) {
    const customer = await this.customersService.getByEmail(payload.email);
    if (!customer) {
        throw new BadRequestException('Invalid email');
    }
    const token = await this.signUser(customer);
    const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

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

    if (statusCheck && (customer.emailStatus !== UserStatus.ACTIVE)) {
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