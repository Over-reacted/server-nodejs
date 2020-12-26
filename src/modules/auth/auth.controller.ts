import { Controller, Body, Post, Query, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { ChangePasswordPayload } from './payloads/change-password.payload';
import { TokenQueryPayload } from './payloads/token-query.payload';
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
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async login(@Body() payload: LoginPayload) {
    const customer = await this.authService.validateCustomer(payload);
    return await this.authService.getTokenForSignIn(customer);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() payload: RegisterPayload) {
    await this.authService.register(payload);
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
  async resetPassword(@Query() query: TokenQueryPayload, @Body() payload : ChangePasswordPayload) {
      await this.authService.resetPassword(query.token, payload);
  }

  @Post('/forgotPassword')
  @ApiResponse({ status: 200, description: 'Successful email verification' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Email is not confirmed' })
  async forgotPassword(@Body() payload: ForgotPasswordPayload) {
      await this.authService.forgotPassword(payload);
  }
}