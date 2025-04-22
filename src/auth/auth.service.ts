import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PrismaService } from '../modules/prisma/prisma.service';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async login(username: string, inputPassword: string): Promise<any> {
    try {
      const user = await this.findUserByUsername(username);
      const passwordsMatch = await bcrypt.compare(inputPassword, user.password);
      if (!passwordsMatch) {
        throw new UnauthorizedException();
      }

      return await this.generateToken({ id: user.id, username });
    } catch (err) {
      console.log('Error retrieving user:', err);
      throw new UnauthorizedException();
    }
  }

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
      const accessToken = await this.generateToken({
        id: result.id,
        username: result.username,
      });
      return { ...result, ...accessToken };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async findUserByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: { username: username },
    });
  }

  async generateToken(tokenPayload: {
    id: string;
    username: string;
  }): Promise<any> {
    const payload = { sub: tokenPayload.id, username: tokenPayload.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
