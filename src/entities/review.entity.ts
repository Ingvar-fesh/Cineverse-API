import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";
import { User } from "./user.entity";
import { CreateDateColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn()
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    @JoinColumn()
    movie: Movie;

    @Column()
    movieId: number;
}