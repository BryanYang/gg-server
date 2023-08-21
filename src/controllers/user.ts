import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from '../services/user';
import { User } from '../models/user';
import { UserDto } from '../dto/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<UserDto | null> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<UserDto | null> {
    return this.userService.update(id, updateData);
  }
}
