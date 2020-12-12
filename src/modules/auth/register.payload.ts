import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';

export class RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    required: false,
  })
  description!: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password!: string;

  @ApiProperty({
    required: true,
  })
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  location!: string;
}