import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCustomer, JwtAuthGuard } from "common";
import { Customer } from "./customer.entity";
import { CustomersService } from "./customer.service";
import { ChangePasswordPayload } from "./payloads/change-password.payload";

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
@ApiTags('profile')
export class CustomerController {
  constructor(
    private readonly customersService: CustomersService
  ) {}

  @Post('/changePassword')
  @ApiResponse({ status: 200, description: 'Successfully changed password' })
  @ApiResponse({ status: 400, description: 'Incorrect password' })
  async changePassword(@GetCustomer() customer : Customer, @Body() payload: ChangePasswordPayload) {
      await this.customersService.changePassword(customer.id, payload.currentPassword, payload.newPassword);
  }
}