import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ConfirmAccountDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    token: string;
}