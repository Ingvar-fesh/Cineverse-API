import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from 'src/entities/genre.entity';
import { CreateGenreDto } from 'src/dto/create-genre.dto';

@Controller('genres')
export class GenresController {
    constructor(
        private readonly genresService: GenresService
    ) {}

    @Get()
    async findAll(): Promise<Genre[]> {
        return this.genresService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.genresService.findById(id);
    }

    @Post()
    async create(@Body() createGenreDto: CreateGenreDto) {
        this.genresService.addGenre(createGenreDto);
    }
}

