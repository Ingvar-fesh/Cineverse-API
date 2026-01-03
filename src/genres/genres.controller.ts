import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from 'src/entities/genre.entity';
import { CreateGenreDto } from 'src/dto/create-genre.dto';
import { UpdateActorDto } from 'src/dto/update-actor.sto';
import { UpdateGenreDto } from 'src/dto/update-genre.dto';
import { SkipAuth } from 'src/auth/skip-auth.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/role.enum';

@Controller('genres')
export class GenresController {
    constructor(
        private readonly genresService: GenresService
    ) {}

    @SkipAuth()
    @Get()
    async findAll(): Promise<Genre[]> {
        return this.genresService.findAll()
    }

    @SkipAuth()
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.genresService.findById(id);
    }

    @Post()
    async create(@Body() createGenreDto: CreateGenreDto) {
        this.genresService.create(createGenreDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
        return this.genresService.update(+id, updateGenreDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.genresService.remove(+id);
    }
}

