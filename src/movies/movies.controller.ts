import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from 'src/entities/movie.entity';
import { CreateMovieDto } from 'src/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.findById(id);
    }

    @Get()
    async findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
        return this.moviesService.update(id, updateMovieDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.remove(id);
    }
}
