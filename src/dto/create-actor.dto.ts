import { IsAlpha, IsArray, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateActorDto {
    @IsString()
    name: string;

    @IsDateString()
    dateOfBirth: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    filmography: string[]; 
}