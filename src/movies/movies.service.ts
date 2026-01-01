import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>
    ) {}

    findAll(): Promise<Movie[]> {
        return this.moviesRepository.find({
            relations: ['genres'],
        })
    } 

    findById(id: number): Promise<Movie | null> {
        return this.moviesRepository.findOne({
            where: { id },
            relations: ['genres'],
        });
    }

    findByTitle(title: string): Promise<Movie | null> {
        return this.moviesRepository.findOneBy({ title });
    }

    async addMovie(createMovieDto) {
        const movieGenres: Genre[] = []

        for (const genreName of createMovieDto.genres) {
            let genre = await this.genresRepository.findOne({where: { name: genreName }});

            if (!genre) {
                genre = this.genresRepository.create({
                    name: genreName,
                    description: 'Auto-created genre description'
                })
                await this.genresRepository.save(genre)
            }

            movieGenres.push(genre)
        }

        const movie = this.moviesRepository.create({
            ...createMovieDto,
            genres: movieGenres,
        })

        this.moviesRepository.save(movie)
    }
}
