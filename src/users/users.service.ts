import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new ConflictException('This email already exists');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const user = this.usersRepository.create({
            email: createUserDto.email,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
}
