import { Module } from '@nestjs/common';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actor } from 'src/entities/actor.entity';
import { Movie } from 'src/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor, Movie])],
  controllers: [ActorsController],
  providers: [ActorsService]
})
export class ActorsModule {}
