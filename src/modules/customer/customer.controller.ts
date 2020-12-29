import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCustomer, JwtAuthGuard } from "common";
import { Customer } from "./customer.entity";
import { CustomersService } from "./customer.service";
import { ChangePasswordPayload } from "./payloads/change-password.payload";
import { UpdateCustomerPayload } from "./payloads/update-customer.payload";

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
@ApiTags('profile')
export class CustomerController {
  constructor(
    private readonly customersService: CustomersService
  ) {}

  @Post('/changePassword')
  @ApiResponse({ status: 201, description: 'Successfully changed password' })
  @ApiResponse({ status: 400, description: 'Incorrect password' })
  async changePassword(@GetCustomer() customer : Customer, @Body() payload: ChangePasswordPayload) {
    await this.customersService.changePassword(customer.id, payload.currentPassword, payload.newPassword);
  }

  @Post('/update')
  @ApiResponse({ status: 201, description: 'Successfully updated information' })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async update(@GetCustomer() customer : Customer, @Body() payload: UpdateCustomerPayload) {
    await this.customersService.update(customer.id, payload);
  }
}