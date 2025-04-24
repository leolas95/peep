import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * Retrieves a single record from the database matching the provided ID.
   *
   * @param {string} id - The unique identifier of the record to retrieve.
   * @param {object} [select] - Optional selection criteria to specify which fields to include in the result. It's a mapping from column name to boolean.
   * @return {Promise<object|null>} Returns a promise resolving to the record object if found, or null if no record matches the specified ID.
   */
  findOne(id: string, select?: object) {
    return this.prismaService.peep.findUnique({
      where: { id: id },
      // Adds the `select: {}` object only if it's set
      ...(select ? { select } : {}),
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

    return this.prismaService.likes.upsert({
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

  async repeep(id: string, userId: string) {
    // Copy content from the original peep
    const originalPeep = await this.findOne(id, { content: true });
    if (!originalPeep) {
      throw new NotFoundException('Peep not found');
    }

    const newPeep: CreatePeepDto = {
      content: originalPeep.content,
      user_id: userId,
    };

    return this.create(newPeep);
  }
}
