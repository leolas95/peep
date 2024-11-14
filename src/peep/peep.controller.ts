import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const peep = await this.peepService.findOne(id);
    if (!peep) {
      throw new NotFoundException('peep not found');
    }
    return peep;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peepService.remove(id);
  }
}
