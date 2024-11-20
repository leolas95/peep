import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnFollowUserDto } from './dto/unfollow-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':userId/peeps')
  findAllPeeps(@Param('userId') userId: string) {
    return this.userService.findAllPeeps(userId);
  }

  @Get(':userId/timeline')
  getTimeline(@Param('userId') userId: string) {
    return this.userService.getTimeline(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const { count } = await this.userService.update(id, updateUserDto);
    if (count === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User updated successfully', code: HttpStatus.OK };
  }

  @Post('followees')
  follow(@Body() followUserDto: FollowUserDto) {
    return this.userService.followUser(followUserDto);
  }

  @Delete('followees')
  unfollow(@Body() unfollowUserDto: UnFollowUserDto) {
    return this.userService.unfollow(unfollowUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { count } = await this.userService.remove(id);
    if (count === 0) {
      throw new NotFoundException('User not found. Nothing was removed');
    }

    return { message: 'User deleted successfully', code: HttpStatus.OK };
  }
}
