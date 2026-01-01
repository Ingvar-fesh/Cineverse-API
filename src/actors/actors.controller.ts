import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from 'src/dto/create-actor.dto';

@Controller('actors')
export class ActorsController {
    constructor(
        private readonly actorsService: ActorsService
    ) {}

    @Get()
    findAll() {
        return this.actorsService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.findById(id);
    }

    @Post()
    create(@Body() createActorDto: CreateActorDto) {
        this.actorsService.addActor(createActorDto);
    }
}
