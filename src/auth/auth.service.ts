import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, inputPassword: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);
      const passwordsMatch = await bcrypt.compare(inputPassword, user.password);
      if (!passwordsMatch) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      console.log('Error retrieving user:', err);
      throw new UnauthorizedException();
    }
  }
}
