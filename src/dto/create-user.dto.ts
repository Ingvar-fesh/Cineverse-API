import { IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'user@cineverse.com', description: 'User email address' })
    @IsString()
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'Strong password (min 8 chars, 1 number/symbol)' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))/, { message: 'Password must contain a number or symbol' })
    password: string;
}