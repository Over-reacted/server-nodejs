import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TokenQueryPayload {
    @ApiProperty({
      required: true
    })
    @IsNotEmpty()
    token: string;
}