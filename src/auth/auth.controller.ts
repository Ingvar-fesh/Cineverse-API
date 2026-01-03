import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { SkipAuth } from './skip-auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @SkipAuth()
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @SkipAuth()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
