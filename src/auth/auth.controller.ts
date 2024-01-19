import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() signInDto: Record<string, any>) {
    const { username, password } = signInDto;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException(
        'user not found or password failed',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
