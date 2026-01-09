import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
    @ApiProperty({ example: 5, description: 'Rating between 1 and 5', minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ example: 'Amazing movie, highly recommended!', description: 'The text content of the review' })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({ example: 10, description: 'The ID of the movie being reviewed' })
    @IsInt()
    movieId: number;
}