import {
  Body,
  Controller,
  Delete,
  Get,
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
