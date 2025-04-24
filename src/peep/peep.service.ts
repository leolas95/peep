import { ImATeapotException, Injectable } from '@nestjs/common';
import { CreatePeepDto } from './dto/create-peep.dto';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class PeepService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPeepDto: CreatePeepDto) {
    return this.prismaService.peep.create({ data: createPeepDto });
  }

  findAllUserPeeps(userId: string) {
    return this.prismaService.peep.findMany({
      where: { user_id: userId },
    });
  }

  findOne(id: string) {
    return this.prismaService.peep.findUnique({
      where: { id: id },
    });
  }

  remove(id: string) {
    return this.prismaService.peep.deleteMany({ where: { id: id } });
  }

  async like(id: string, userId: string) {
    const existingUserLike = await this.prismaService.user_likes.findUnique({
      where: { user_id_peep_id: { user_id: userId, peep_id: id } },
      select: { id: true },
    });

    // User already liked, throw an error
    if (existingUserLike) {
      // TODO return proper error
      throw new ImATeapotException();
    }

    const newUserLike = await this.prismaService.user_likes.create({
      data: {
        peep_id: id,
        user_id: userId,
      },
    });
    if (!newUserLike) {
      // TODO return proper error
      throw new ImATeapotException();
    }

    const res = this.prismaService.likes.upsert({
      create: {
        peep_id: id,
        like_count: 1,
      },
      update: {
        like_count: {
          increment: 1,
        },
      },
      where: { peep_id: id },
      select: {
        peep_id: true,
        like_count: true,
        created_at: true,
      },
    });
    return res;
  }

  async unlike(id: string, userId: string) {
    const { count } = await this.prismaService.user_likes.deleteMany({
      where: { user_id: userId, peep_id: id },
    });

    if (count === 0) {
      // TODO return proper error
      throw new ImATeapotException();
    }

    return this.prismaService.likes.update({
      data: {
        like_count: {
          decrement: 1,
        },
      },
      where: { peep_id: id },
      select: {
        like_count: true,
        created_at: true,
        peep_id: true,
      },
    });
  }
}
