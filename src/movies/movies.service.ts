import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';
import { Actor } from 'src/entities/actor.entity';
import { Genre } from 'src/entities/genre.entity';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>,
        private redisCache: RedisCacheService
    ) {}

    private calculateRating(reviews: any[]): number {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return parseFloat((totalRating / reviews.length).toFixed(1));
    }

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
        const cacheKey = 'movies:all';
        const cached = await this.redisCache.get<any[]>(cacheKey);
        if (cached) return cached;

        const movies = await this.moviesRepository.find({
            relations: ['genres', 'actors', 'reviews'],
        });

        const result = movies.map(movie => {
            const averageRating = this.calculateRating(movie.reviews);
            const { reviews, ...movieData } = movie; 
            return { ...movieData, averageRating };
        });

        await this.redisCache.set(cacheKey, result);
        return result;
    }

    async findById(id: number): Promise<any> {
        const cacheKey = `movies:${id}`;
        const cached = await this.redisCache.get<any>(cacheKey);
        if (cached) return cached;

        const movie = await this.moviesRepository.findOne({
            where: { id },
            relations: ['genres', 'actors', 'reviews'],
        });

        if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

        const averageRating = this.calculateRating(movie.reviews);
        const result = { ...movie, averageRating };
        
        await this.redisCache.set(cacheKey, result);
        return result;
    }

    findByTitle(title: string): Promise<Movie | null> {
        return this.moviesRepository.findOneBy({ title });
    }

    async create(createMovieDto) {
        const genres = await this.resolveGenres(createMovieDto.genres || []);

        const actors = (createMovieDto.actorIds || []).map(id => ({ id } as Actor));

        const movie = this.moviesRepository.create({
            ...createMovieDto,
            genres: genres,
            actors: actors,
        });

        const savedMovie = await this.moviesRepository.save(movie);
        await this.redisCache.del('movies:all');

        return savedMovie;
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({ 
            where: { id },
            relations: ['genres'] 
        });

        if (!movie) throw new NotFoundException(`Movie #${id} not found`);

        if (updateMovieDto.genres) {
            movie.genres = await this.resolveGenres(updateMovieDto.genres);
        }

        if (updateMovieDto.actorIds) {
            movie.actors = updateMovieDto.actorIds.map(actorId => ({ id: actorId } as Actor));
        }

        Object.assign(movie, updateMovieDto);

        const updatedMovie = this.moviesRepository.save(movie);

        await this.redisCache.del('movies:all');
        await this.redisCache.del(`movies:${id}`);

        return updatedMovie;
    }

    async remove(id: number): Promise<void> {
        const result = await this.moviesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Movie #${id} not found`);
        }

        await this.redisCache.del('movies:all');
        await this.redisCache.del(`movies:${id}`);
    }
}
