import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateAdDto {

  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(60)
  title!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  category!: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(600)
  description!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  phone!: string;
}
