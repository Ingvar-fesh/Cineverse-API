import { IsAlpha, IsArray, IsOptional, IsString } from "class-validator";

export class CreateActorDto {
    @IsString()
    name: string;

    @IsString()
    birthDate: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    filmography: string[]; 
}