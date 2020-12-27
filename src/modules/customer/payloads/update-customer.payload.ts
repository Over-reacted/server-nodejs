import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, MaxLength } from "class-validator";

export class UpdateCustomerPayload {
  @ApiProperty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsPhoneNumber(null)
  phoneNumber: string;

  @ApiProperty()
  @MaxLength(35)
  location: string;
}