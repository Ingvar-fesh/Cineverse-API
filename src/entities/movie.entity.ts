import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Actor } from "./actor.entity";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    release_date: string;

    @Column()
    poster: string;

    @Column()
    trailer_link: string;

    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable() 
    genres: Genre[];

    @ManyToMany(() => Actor, (actor) => actor.filmography)
    @JoinTable()
    actors: Actor[]
}