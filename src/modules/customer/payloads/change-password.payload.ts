import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Match } from 'common';

export class ChangePasswordPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  currentPassword!: string;
    
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  newPassword!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @Match('password', { message: "Confirm password doesn't match" })
  confirmPassword!: string;
}