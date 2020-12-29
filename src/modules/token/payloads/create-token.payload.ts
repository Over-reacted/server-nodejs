import { IsString } from 'class-validator';

export class CreateTokenPayload {
    @IsString()
    token: string;

    @IsString()
    customerId: number;
}