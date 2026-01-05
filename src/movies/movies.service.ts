import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';
import { Actor } from 'src/entities/actor.entity';
import { Genre } from 'src/entities/genre.entity';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
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
        })

        const result = movies.map(movie => {
            const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = movie.reviews.length > 0 
                ? +(totalRating / movie.reviews.length).toFixed(1) 
                : 0;
            const { reviews, ...movieData } = movie; 
            return { ...movieData, averageRating };
        })

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

        const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avarageRating = movie.reviews.length > 0 
            ? (totalRating / movie.reviews.length).toFixed(1)
            : 0;

        const result = { ...movie, avarageRating }
        
        await this.redisCache.set(cacheKey, result);
        
        return result;
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

        await this.redisCache.del('movies:all');

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
