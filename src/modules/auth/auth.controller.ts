import { Controller, Body, Post, Query, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { ConfirmAccountPayload } from './payloads/confirm-account.payload';
import { ForgotPasswordPayload } from './payloads/forgot-password.payload';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() payload: LoginPayload) {
    const customer = await this.authService.validateCustomer(payload);
    return await this.authService.getTokenForSignIn(customer);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    await this.authService.register(payload);
  }

  @Get('/confirm')
  async confirm(@Query() query: ConfirmAccountPayload) {
      await this.authService.confirm(query.token);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() payload: ForgotPasswordPayload) {
      await this.authService.forgotPassword(payload);
  }
}
