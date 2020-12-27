import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomersService],
  providers: [CustomersService],
  controllers: [CustomerController]
})
export class CustomerModule {}
