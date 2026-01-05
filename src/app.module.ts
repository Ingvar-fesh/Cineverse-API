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
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './entities/review.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

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
      entities: [Movie, Genre, Actor, User, Review],
      synchronize: true
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT!) || 6379,
            reconnectStrategy: (retries) => {
                console.warn(`Redis connection lost. Retrying... Attempt #${retries}`);
                return Math.min(retries * 50, 2000);
            },
          },
          ttl: 60 * 1000,
        }),
      }),
    }),
    GenresModule,
    ActorsModule,
    AuthModule,
    UsersModule,
    ReviewsModule,
    RedisCacheModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
