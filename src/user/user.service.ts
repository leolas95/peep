import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { PeepService } from '../peep/peep.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly peepService: PeepService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findAllPeeps(id: string) {
    return this.peepService.findAllUserPeeps(id);
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
