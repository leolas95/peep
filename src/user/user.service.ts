import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../modules/prisma/prisma.service';
import { PeepService } from '../peep/peep.service';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnFollowUserDto } from './dto/unfollow-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly peepService: PeepService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Using try/catch and async/await is the most Typescripty way of handling
    // Promises now. Other options are .then() and .catch(), or using a mix of both:
    //  const hash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS)
    //     .catch(err => {
    //       throw new UnauthorizedException(err);
    //     });
    // But that last one looks ugly to me.
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        SALT_ROUNDS,
      );
      const userData = { ...createUserDto, password: hashedPassword };
      const user = await this.prismaService.user.create({
        data: userData,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, created_at, ...result } = user;
      // TODO: return also access token so user is automatically logged in
      return result;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  findAllPeeps(id: string) {
    return this.peepService.findAllUserPeeps(id);
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }

  findByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: { username: username },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.updateMany({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prismaService.user.deleteMany({
      where: { id: id },
    });
  }

  followUser(followUserDto: FollowUserDto) {
    const { follower_id, followee_id } = followUserDto;
    return this.prismaService.follows.create({
      data: {
        follower_id: follower_id,
        followee_id: followee_id,
      },
    });
  }

  unfollow(unfollowDto: UnFollowUserDto) {
    const { follower_id, followee_id } = unfollowDto;
    return this.prismaService.follows.delete({
      where: {
        follower_id_followee_id: {
          follower_id: follower_id,
          followee_id: followee_id,
        },
      },
    });
  }

  getTimeline(userId: string) {
    // We only need the `join users on follows...` because we want to also show
    // info about the Peep author. If we wouldn't, then just the `join peeps on...`
    // is fine.
    return this.prismaService.$queryRaw`
      select peeps.*
      from follows
      join users on follows.followee_id = users.id
      join peeps on follows.followee_id = peeps.user_id
      where follower_id = ${userId}::uuid;
    `;
  }
}
