import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PeepService } from './peep.service';
import { CreatePeepDto } from './dto/create-peep.dto';

@Controller('peeps')
export class PeepController {
  constructor(private readonly peepService: PeepService) {}

  @Post()
  create(@Body() createPeepDto: CreatePeepDto) {
    return this.peepService.create(createPeepDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peepService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peepService.remove(id);
  }
}
