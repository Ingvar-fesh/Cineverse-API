import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from 'src/entities/movie.entity';
import { CreateMovieDto } from 'src/dto/create-movie.dto';

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
        return this.moviesService.addMovie(createMovieDto);
    }
}
