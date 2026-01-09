import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from 'src/dto/create-actor.dto';
import { UpdateActorDto } from 'src/dto/update-actor.dto';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
    constructor(
        private readonly actorsService: ActorsService
    ) {}

    @SkipAuth()
    @ApiOperation({ summary: 'Get all actors' })
    @ApiResponse({ status: 200, description: 'List of all actors.' })
    @Get()
    findAll() {
        return this.actorsService.findAll();
    }

    @SkipAuth()
    @ApiOperation({ summary: 'Get an actor by ID' })
    @ApiResponse({ status: 200, description: 'The actor found.' })
    @ApiResponse({ status: 404, description: 'Actor not found.' })
    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.actorsService.findOneById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new actor' })
    @ApiResponse({ status: 201, description: 'Actor created successfully.' })
    @Post()
    async create(@Body() createActorDto: CreateActorDto) {
        return await this.actorsService.create(createActorDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an actor' })
    @ApiResponse({ status: 200, description: 'Actor updated.' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateActorDto: UpdateActorDto) {
        return this.actorsService.update(id, updateActorDto);
    }

    @ApiBearerAuth()
    @Roles(Role.Admin) // Only Admin
    @ApiOperation({ summary: 'Delete an actor (Admin only)' })
    @ApiResponse({ status: 200, description: 'Actor deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.actorsService.remove(+id);
    }
}
