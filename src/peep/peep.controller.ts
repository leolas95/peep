import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PeepService } from './peep.service';
import { CreatePeepDto } from './dto/create-peep.dto';
import { Request } from 'express';

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
  async remove(@Param('id', ParseUUIDPipe) id: string) {
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

  @Post(':id/like')
  async like(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req['user'];
    return this.peepService.like(id, user.sub);
  }

  @Patch(':id/like')
  async unlike(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req['user'];
    return this.peepService.unlike(id, user.sub);
  }
}
