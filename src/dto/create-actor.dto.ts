import { IsArray, IsDateString, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateActorDto {
    @ApiProperty({ example: 'Leonardo DiCaprio', description: 'The full name of the actor' })
    @IsString()
    name: string;

    @ApiProperty({ example: '1974-11-11', description: 'Date of birth (ISO8601 format)' })
    @IsDateString()
    dateOfBirth: string;

    @ApiPropertyOptional({ example: ['Inception', 'Titanic'], description: 'List of known movies' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    filmography: string[]; 
}