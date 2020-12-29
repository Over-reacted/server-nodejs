import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { TokensService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  exports: [TokensService],
  providers: [TokensService],
})

export class TokenModule {}
