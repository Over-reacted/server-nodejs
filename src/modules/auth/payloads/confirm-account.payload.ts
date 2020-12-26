import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ConfirmAccountPayload {
    @ApiProperty({
      required: true
    })
    @IsNotEmpty()
    token: string;
}