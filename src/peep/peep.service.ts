import { Injectable } from '@nestjs/common';
import { CreatePeepDto } from './dto/create-peep.dto';
import { UpdatePeepDto } from './dto/update-peep.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PeepService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPeepDto: CreatePeepDto) {
    return this.prismaService.peep.create({ data: createPeepDto });
  }

  findAll() {
    return `This action returns all peep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} peep`;
  }

  update(id: number, updatePeepDto: UpdatePeepDto) {
    return `This action updates a #${id} peep`;
  }

  remove(id: number) {
    return `This action removes a #${id} peep`;
  }
}
