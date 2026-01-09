import { IsArray, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
    @ApiProperty({ example: 'Inception', description: 'The official movie title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'A thief who steals corporate secrets...', description: 'Plot summary' })
    @IsString()
    description: string;

    @ApiProperty({ example: '2010-07-16', description: 'Release date (YYYY-MM-DD)' })
    @IsString()
    release_date: string;

    @ApiProperty({ example: 'https://example.com/poster.jpg', description: 'URL to the movie poster' })
    @IsString()
    poster: string;

    @ApiProperty({ example: 'https://youtube.com/trailer', description: 'URL to the trailer' })
    @IsString()
    trailer_link: string;

    @ApiProperty({ example: ['Action', 'Sci-Fi'], description: 'List of genre names' })
    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @ApiProperty({ example: [1, 4, 15], description: 'Array of Actor IDs involved in the movie' })
    @IsArray()
    @IsNumber({}, { each: true })
    actorIds: number[];
}