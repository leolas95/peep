import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeepService } from './peep.service';
import { CreatePeepDto } from './dto/create-peep.dto';
import { UpdatePeepDto } from './dto/update-peep.dto';

@Controller('peeps')
export class PeepController {
  constructor(private readonly peepService: PeepService) {}

  @Post()
  create(@Body() createPeepDto: CreatePeepDto) {
    return this.peepService.create(createPeepDto);
  }

  @Get()
  findAll() {
    return this.peepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeepDto: UpdatePeepDto) {
    return this.peepService.update(+id, updatePeepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peepService.remove(+id);
  }
}
