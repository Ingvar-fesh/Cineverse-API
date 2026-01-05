import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { MoviesController } from './movies.controller';
import { Genre } from 'src/entities/genre.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { Actor } from 'src/entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre, Actor]),
  RedisCacheModule
  ],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService]
})
export class MoviesModule {}
