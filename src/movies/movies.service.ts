import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';
import { Actor } from 'src/entities/actor.entity';
import { Genre } from 'src/entities/genre.entity';
import { Movie } from 'src/entities/movie.entity';
import { Review } from 'src/entities/review.entity';
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

    async findAll(): Promise<any[]> {
        const movies = await this.moviesRepository.find({
            relations: ['genres', 'actors', 'reviews'],
        })

        return movies.map(movie => {
            const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = movie.reviews.length > 0 
                ? +(totalRating / movie.reviews.length).toFixed(1) 
                : 0;
            return { ...movie, averageRating };
        })
    } 

    async findById(id: number): Promise<any> {
        const movie = await this.moviesRepository.findOne({
            where: { id },
            relations: ['genres', 'actors', 'reviews'],
        });
        if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);

        const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avarageRating = movie.reviews.length > 0 
            ? (totalRating / movie.reviews.length).toFixed(1)
            : 0;
        
        return { ...movie, avarageRating };
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
