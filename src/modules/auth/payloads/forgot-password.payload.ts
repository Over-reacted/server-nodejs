import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordPayload {
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
