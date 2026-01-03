import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { GenresModule } from './genres/genres.module';
import Joi from 'joi';
import { Genre } from './entities/genre.entity';
import { ActorsModule } from './actors/actors.module';
import { Actor } from './entities/actor.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { User } from './entities/user.entity';

@Module({
  imports: [
    MoviesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT!,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Movie, Genre, Actor, User],
      synchronize: true
    }),
    GenresModule,
    ActorsModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
