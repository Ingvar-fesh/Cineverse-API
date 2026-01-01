import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateActorDto } from 'src/dto/create-actor.dto';
import { UpdateActorDto } from 'src/dto/update-actor.sto';
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

    async create(createActorDto: CreateActorDto) {
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

    async update(id: number, updateActorDto: UpdateActorDto) {
        const actor = await this.actorsRepository.findOne({
            where: { id: id },
            relations: ['filmography']
        })

        if (!actor) throw new NotFoundException(`Actor #${id} not found`);

        if (updateActorDto.filmography) {
            const movies: Movie[] = [];

            for (const title of updateActorDto.filmography) {
                let movie = await this.moviesRepository.findOne({ where: { title } });
                
                if (!movie) {
                    movie = this.moviesRepository.create({
                        title,
                        description: 'Pending description...',
                        release_date: new Date().toISOString(),
                        poster: 'no-poster',
                        trailer_link: 'none'
                    });
                    await this.moviesRepository.save(movie);
                }
                movies.push(movie);
            }

            actor.filmography = movies;
        }

        Object.assign(actor, updateActorDto);

        return this.actorsRepository.save(actor);
    }

    async remove(id: number) {
        const result = await this.actorsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Actor #${id} not found`);
        }
    }

}
