import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor (private readonly reviewsService: ReviewsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a review for a movie' })
    @ApiResponse({ status: 201, description: 'Review posted successfully.' })
    @Post()
    async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
        const result = await this.reviewsService.create(req.user.userId, createReviewDto);
        return result;
    }

    @SkipAuth()
    @ApiOperation({ summary: 'Get all reviews for a specific movie' })
    @ApiResponse({ status: 200, description: 'List of reviews.' })
    @Get(':movieId')
    getMovieReviews(@Param('movieId', ParseIntPipe) movieId: number) {
        return this.reviewsService.findAllByMovie(movieId);
    }
}
