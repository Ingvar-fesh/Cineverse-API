import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateGenreDto } from 'src/dto/update-genre.dto';
import { Genre } from 'src/entities/genre.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
    constructor(
        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>,
        private redisCache: RedisCacheService
    ) {}

    async findAll(): Promise<Genre[]> {
        const cacheKey = 'genres:all';

        const cached = await this.redisCache.get<Genre[]>(cacheKey);
        if (cached) return cached;

        const genres = await this.genresRepository.find();
        await this.redisCache.set(cacheKey, genres);

        return genres;
    }

    async findByName(name: string): Promise<Genre | null> {
        return this.genresRepository.findOneBy({ name })
    }

    async findById(id: number): Promise<Genre | null> {
        return this.genresRepository.findOneBy({ id });
    }

    async create(createGenreDto) {
        const genre = this.genresRepository.create({
            ...createGenreDto
        })

        const savedGenre = await this.genresRepository.save(genre);
        await this.redisCache.del('genres:all');
        
        return savedGenre;
    }

    async update(id: number, updateGenreDto: UpdateGenreDto) {
        const genre = await this.genresRepository.findOneBy({ id });
        if (!genre) throw new NotFoundException(`Genre #${id} not found`);

        Object.assign(genre, updateGenreDto);

        await this.genresRepository.save(genre);

        await this.redisCache.del('genres:all'); 
    }

    async remove(id: number) {
        const result = await this.genresRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Genre #${id} not found`);
        }

        await this.redisCache.del('genres:all');
    }
}
