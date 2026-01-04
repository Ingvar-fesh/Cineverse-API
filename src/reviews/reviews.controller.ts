import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { SkipAuth } from 'src/auth/skip-auth.decorator';

@Controller('reviews')
export class ReviewsController {
    constructor (private readonly reviewsService: ReviewsService) {}

    @Post()
    async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
        const result = await this.reviewsService.create(req.user.userId, createReviewDto);
        return result;
    }

    @SkipAuth()
    @Get(':movieId')
    getMovieReviews(@Param('movieId', ParseIntPipe) movieId: number) {
        return this.reviewsService.findAllByMovie(movieId);
    }
}
