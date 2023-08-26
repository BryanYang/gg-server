import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './users.model';
import { UserDto, convertToUserDTO } from '../dto/user';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  async findById(@Request() request): Promise<UserDto | null> {
    return convertToUserDTO(await this.userService.findById(request.user.id));
  }

  @Put()
  async update(
    @Request() request,
    @Body() updateData: Partial<User>,
  ): Promise<UserDto | null> {
    return this.userService.update(request.user.id, updateData);
  }

  @Put('up_password')
  async up_password(
    @Request() request,
    @Body() updateData: { oldPass: string; newPass: string },
  ): Promise<UserDto | null> {
    const user = await this.userService.findById(request.user.id);
    if (!(await bcrypt.compare(updateData.oldPass, user.password))) {
      throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST);
    }
    const salt = bcrypt.genSaltSync(10);
    return this.userService.update(request.user.id, {
      password: await bcrypt.hash(updateData.newPass, salt),
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async create(@Body() updateData: Partial<User>): Promise<UserDto | null> {
    return this.userService.create(updateData);
  }
}
