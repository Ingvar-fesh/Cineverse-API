import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { MoviesController } from './movies.controller';
import { Genre } from 'src/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  providers: [MoviesService],
  controllers: [MoviesController]
})
export class MoviesModule {}
