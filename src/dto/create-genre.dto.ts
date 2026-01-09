import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGenreDto {
    @ApiProperty({ example: 'Sci-Fi', description: 'The name of the genre' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Futuristic concepts and space exploration', description: 'Short description of the genre' })
    @IsString()
    description: string;
}
