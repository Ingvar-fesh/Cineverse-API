import { Role } from "src/users/role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
         default: Role.User
    })
    role: Role

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}