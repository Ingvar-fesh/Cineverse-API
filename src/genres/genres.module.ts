import { Module, Move } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Movie } from 'src/entities/movie.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Genre, Movie])],
    providers: [GenresService],
    controllers: [GenresController]
})
export class GenresModule {}
