import { Injectable } from '@nestjs/common';
import { CreatePeepDto } from './dto/create-peep.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PeepService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPeepDto: CreatePeepDto) {
    return this.prismaService.peep.create({ data: createPeepDto });
  }

  // findAllUserPeeps(userId: string) {
  //   return this.prismaService.peep.findMany({
  //     where: { user_id: userId },
  //   });
  // }

  findOne(id: string) {
    return this.prismaService.peep.findUnique({
      where: { id: id },
    });
  }

  remove(id: string) {
    return this.prismaService.peep.delete({ where: { id: id } });
  }
}
