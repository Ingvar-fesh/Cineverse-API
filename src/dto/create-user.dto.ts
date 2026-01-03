import { IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))/, { message: 'Password must contain a number or symbol' })
    password: string;
}