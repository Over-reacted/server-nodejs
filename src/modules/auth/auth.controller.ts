import { Controller, Body, Post, Query, Get, ConflictException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { ResetPasswordPayload } from './payloads/reset-password.payload';
import { TokenQueryPayload } from './payloads/token-query.payload';
import { EmailPayload } from './payloads/email.payload';
import { CustomersService } from 'modules/customer';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customersService: CustomersService
  ) {}

  @Post('/login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async login(@Body() payload: LoginPayload) {
    const customer = await this.authService.validateCustomer(payload);
    return await this.authService.getTokenForSignIn(customer);
  }

  @Post('/register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() payload: RegisterPayload) {
    await this.authService.register(payload);
  }

  @ApiResponse({ status: 200, description: 'Successfully send verification code' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/resend-verification')
  async sendEmailVerification(@Body() payload: EmailPayload) {
    const customer = await this.customersService.getByEmail(payload.email);
    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer);

    if (isEmailConfirmed) {
      throw new ConflictException('Email is already confirmed');
    }

    await this.authService.sendConfirmation(customer);
  }

  @Get('/confirm')
  @ApiResponse({ status: 201, description: 'Successful email verification' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async confirm(@Query() query: TokenQueryPayload) {
      await this.authService.confirm(query.token);
  }

  @Post('/resetPassword')
  @ApiResponse({ status: 201, description: 'Successful password reset' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async resetPassword(@Query() query: TokenQueryPayload, @Body() payload : ResetPasswordPayload) {
      await this.authService.resetPassword(query.token, payload);
  }

  @Post('/forgotPassword')
  @ApiResponse({ status: 200, description: 'Successful email verification' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async forgotPassword(@Body() payload: EmailPayload) {
      await this.authService.forgotPassword(payload);
  }
}