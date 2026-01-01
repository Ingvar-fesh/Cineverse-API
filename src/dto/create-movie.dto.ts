import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    release_date: string;

    @IsString()
    poster: string;

    @IsString()
    trailer_link: string;

    @IsArray()
    @IsString({ each: true })
    genres: string[];
}