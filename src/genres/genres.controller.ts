import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from 'src/entities/genre.entity';
import { CreateGenreDto } from 'src/dto/create-genre.dto';
import { UpdateActorDto } from 'src/dto/update-actor.dto';
import { UpdateGenreDto } from 'src/dto/update-genre.dto';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
    constructor(
        private readonly genresService: GenresService
    ) {}

    @SkipAuth()
    @ApiOperation({ summary: 'Get all genres' })
    @ApiResponse({ status: 200, description: 'List of all genres.' })
    @Get()
    async findAll(): Promise<Genre[]> {
        return this.genresService.findAll()
    }

    @SkipAuth()
    @ApiOperation({ summary: 'Get a genre by ID' })
    @ApiResponse({ status: 200, description: 'The genre found.' })
    @ApiResponse({ status: 404, description: 'Genre not found.' })
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.genresService.findById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new genre' })
    @ApiResponse({ status: 201, description: 'Genre created.' })
    @Post()
    async create(@Body() createGenreDto: CreateGenreDto) {
        return this.genresService.create(createGenreDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a genre' })
    @ApiResponse({ status: 200, description: 'Genre updated.' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
        return this.genresService.update(+id, updateGenreDto);
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Delete a genre (Admin only)' })
    @ApiResponse({ status: 200, description: 'Genre deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.genresService.remove(+id);
    }
}

