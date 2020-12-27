import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomersService],
  providers: [CustomersService]
})
export class CustomerModule {}
