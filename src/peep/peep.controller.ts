import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
      throw new NotFoundException('Peep not found');
    }
    return peep;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // https://github.com/prisma/prisma/issues/9460
    // https://github.com/prisma/prisma/issues/4072
    // TLDR: Prisma doesn't natively support deleting a record that doesn't
    // exist, we have to handle it manually. The recommended way is to check
    // the count
    const { count } = await this.peepService.remove(id);
    if (count === 0) {
      throw new NotFoundException('Peep not found. Nothing was removed');
    }
    return { message: 'Peep deleted successfully', code: HttpStatus.OK };
  }
}
