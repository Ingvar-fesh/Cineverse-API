import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from 'src/dto/create-actor.dto';
import { UpdateActorDto } from 'src/dto/update-actor.sto';

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
        this.actorsService.create(createActorDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
        return this.actorsService.update(+id, updateActorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.actorsService.remove(+id);
    }
}
