import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../modules/prisma/prisma.service';
import { PeepService } from '../peep/peep.service';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnFollowUserDto } from './dto/unfollow-user.dto';

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
