import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
    constructor(
        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>
    ) {}

    async findAll(): Promise<Genre[]> {
        return this.genresRepository.find()
    }

    async findByName(name: string): Promise<Genre | null> {
        return this.genresRepository.findOneBy({ name })
    }

    async findById(id: number): Promise<Genre | null> {
        return this.genresRepository.findOneBy({ id });
    }

    async addGenre(createGenreDto) {
        const genre = this.genresRepository.create({
            ...createGenreDto
        })

        this.genresRepository.save(genre)
    }
}
