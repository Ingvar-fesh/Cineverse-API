import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    } 

    findById(id: number): Promise<Movie | null> {
        return this.moviesRepository.findOneBy({ id });
    }

    findByTitle(title: string): Promise<Movie | null> {
        return this.moviesRepository.findOneBy({ title });
    }

    addMovie(createMovieDto) {
        const movie = this.moviesRepository.create({
            ...createMovieDto
        })
        
        this.moviesRepository.save(movie)
    }
}
