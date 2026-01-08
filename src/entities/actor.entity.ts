import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: string;

    @ManyToMany(() => Movie, (movie) => movie.actors)
    filmography: Movie[];
}