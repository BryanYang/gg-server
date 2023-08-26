import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUser({ email: username });
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      email: user.email,
      roles: user.isTeacher ? ['teacher'] : ['student'],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
