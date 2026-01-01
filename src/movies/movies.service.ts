import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';
import { Actor } from 'src/entities/actor.entity';
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

    private async resolveGenres(genreNames: string[]): Promise<Genre[]> {
        const movieGenres: Genre[] = [];

        for (const name of genreNames) {
            let genre = await this.genresRepository.findOne({ where: { name } });
            if (!genre) {
                genre = this.genresRepository.create({ 
                    name, 
                    description: 'Auto-created' 
                });
                await this.genresRepository.save(genre);
            }
            movieGenres.push(genre);
        }
        return movieGenres;
    }

    findAll(): Promise<Movie[]> {
        return this.moviesRepository.find({
            relations: ['genres', 'actors'],
        })
    } 

    async findById(id: number): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({
            where: { id },
            relations: ['genres', 'actors'],
        });
        if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
        return movie;
    }

    findByTitle(title: string): Promise<Movie | null> {
        return this.moviesRepository.findOneBy({ title });
    }

    async create(createMovieDto) {
        const genres = await this.resolveGenres(createMovieDto.genres || []);

        const actors = createMovieDto.actorIds.map(id => ({ id } as Actor));

        const movie = this.moviesRepository.create({
            ...createMovieDto,
            genres: genres,
            actors: actors,
        });

        return this.moviesRepository.save(movie);
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({ 
            where: { id },
            relations: ['genres'] 
        });

        if (!movie) throw new NotFoundException(`Movie #${id} not found`);

        if (updateMovieDto.genres) {
            const newGenres = await this.resolveGenres(updateMovieDto.genres);
            movie.genres = newGenres;
        }

        Object.assign(movie, updateMovieDto);

        return this.moviesRepository.save(movie);
    }

    async remove(id: number): Promise<void> {
        const result = await this.moviesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Movie #${id} not found`);
        }
    }
}
