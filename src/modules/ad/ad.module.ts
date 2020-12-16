
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'modules/customer';
import { Ad } from './ad.entity';
import { AdsService } from './ad.service';
import { AdsController } from './ads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Customer])],
  providers: [AdsService],
  controllers: [AdsController]
})
export class AdModule {}
