import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from 'src/entities/movie.entity';
import { CreateMovieDto } from 'src/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}
    @SkipAuth()
    @ApiOperation({ summary: 'Get a movie by ID' })
    @ApiResponse({ status: 200, description: 'Movie details.' })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.findById(id);
    }

    @SkipAuth()
    @ApiOperation({ summary: 'Get all movies' })
    @ApiResponse({ status: 200, description: 'List of all movies.' })
    @Get()
    async findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiResponse({ status: 201, description: 'Movie created.' })
    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a movie' })
    @ApiResponse({ status: 200, description: 'Movie updated.' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
        return this.moviesService.update(id, updateMovieDto);
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Delete a movie (Admin only)' })
    @ApiResponse({ status: 200, description: 'Movie deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.remove(id);
    }
}
