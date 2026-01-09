import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import { Role } from "./users/role.enum";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('Error: admin email or admin password not found in .env');
        process.exit(1);
    }

    console.log(`Seeding Admin: ${adminEmail}...`);

    const userRepository = dataSource.getRepository(User);
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

    if (existingAdmin) {
        console.log('Admin already exists. Skipping.');
    } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = userRepository.create({
            email: adminEmail,
            password: hashedPassword,
            role: Role.Admin,
        });

        await userRepository.save(newAdmin);
        console.log('Admin created successfully!');
    }

    await app.close();
}

bootstrap();