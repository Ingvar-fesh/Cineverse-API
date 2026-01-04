import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { Review } from 'src/entities/review.entity';
import { MoviesService } from 'src/movies/movies.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
    constructor (
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        private moviesService: MoviesService
    ) {}

    async create(userId: number, createReviewDto: CreateReviewDto) {
        const movie = await this.moviesService.findById(createReviewDto.movieId);

        if (!movie) {
            throw new NotFoundException('Movie not found!');
        }

        const existingReview = await this.reviewsRepository.findOne({
            where: { userId, movieId: createReviewDto.movieId }
        });

        if (existingReview) {
            throw new ConflictException('You have already reviewed this movie');
        }

        const movieReview = this.reviewsRepository.create({
            ...createReviewDto,
            userId,
        });

        return this.reviewsRepository.save(movieReview);
    }

    async findAllByMovie(movieId: number) {
        return this.reviewsRepository.find({
            where: { movieId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
}
