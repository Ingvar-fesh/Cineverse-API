import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateGenreDto } from 'src/dto/update-genre.dto';
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

    async create(createGenreDto) {
        const genre = this.genresRepository.create({
            ...createGenreDto
        })

        this.genresRepository.save(genre)
    }

    async update(id: number, updateGenreDto: UpdateGenreDto) {
        const genre = await this.genresRepository.findOneBy({ id });
        if (!genre) throw new NotFoundException(`Genre #${id} not found`);

        Object.assign(genre, updateGenreDto);
        return this.genresRepository.save(genre);
    }

    async remove(id: number) {
        const result = await this.genresRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Genre #${id} not found`);
        }
    }
}
