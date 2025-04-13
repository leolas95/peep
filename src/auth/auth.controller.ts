import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginUserDto,
  ) {
    try {
      // Note: If I don't use async/await here, then the exception won't be
      // caught in this try/catch. It will be caught later on in the pipeline
      // when Nest resolves the Promise. At that point it will return a default
      // Nest object for the 401 UNAUTHORIZED error, instead of the custom one
      // we have below. So await the result here.
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch {
      // Note: Apparently the only way to manually set status codes is meddling
      // with the Response object, which is platform specific (in our case, express)
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'Invalid credentials' });
    }
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
