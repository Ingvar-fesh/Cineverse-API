import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateActorDto } from 'src/dto/create-actor.dto';
import { Actor } from 'src/entities/actor.entity';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActorsService {
    constructor(
        @InjectRepository(Actor)
        private actorsRepository: Repository<Actor>,
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>
    ) {}

    findAll() {
        return this.actorsRepository.find();
    }

    findOneById(actorId: number) {
        return this.actorsRepository.findOneBy({ id: actorId });
    }

    async addActor(createActorDto: CreateActorDto) {
        const filmography: Movie[] = []

        const movieTitles = createActorDto.filmography || [];

        for (const movieTitle of movieTitles) {
            

            let movie = await this.moviesRepository.findOne({where: { title: movieTitle }});

            if (!movie) {
                movie = this.moviesRepository.create({
                    title: movieTitle,
                    description: 'Description pending...', 
                    release_date: new Date().toISOString(),
                    poster: 'no-poster',
                    trailer_link: 'none'
                });
                await this.moviesRepository.save(movie);
            }

            filmography.push(movie);
        }

        const actor = this.actorsRepository.create({
            ...createActorDto,
            filmography: filmography, 
        });

        return this.actorsRepository.save(actor);
    }
}
