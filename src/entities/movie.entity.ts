import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Actor } from "./actor.entity";
import { Review } from "./review.entity";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'date' })
    release_date: string;

    @Column()
    poster: string;

    @Column()
    trailer_link: string;

    @ManyToMany(() => Genre)
    @JoinTable({
        name: 'movie_genres',
        joinColumn: {
            name: 'movie_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'genre_id',
            referencedColumnName: 'id'
        }
    })
    genres: Genre[];

    @ManyToMany(() => Actor, (actor) => actor.filmography)
    @JoinTable({
        name: 'movie_actors',
        joinColumn: { 
            name: 'movieId',
            referencedColumnName: 'id' 
        },
        inverseJoinColumn: { 
            name: 'actorId',
            referencedColumnName: 'id' 
        }
    })
    actors: Actor[]

    @OneToMany(() => Review, (review) => review.movie)
    reviews: Review[];
}