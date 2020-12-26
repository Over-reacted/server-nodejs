import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Match } from "../decorators/match.decorator";

export class ResetPasswordPayload {
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