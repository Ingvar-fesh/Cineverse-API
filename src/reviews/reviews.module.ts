import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    MoviesModule
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
