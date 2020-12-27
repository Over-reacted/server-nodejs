import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'shared';

export class RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @Match('password', { message: "Confirm password doesn't match" })
  confirmPassword!: string;
}