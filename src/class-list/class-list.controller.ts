import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClassListService } from './class-list.service';
import { ClassList } from 'src/models/class-list';
import { User } from 'src/models/user';

@Controller('class-list')
export class ClassListController {
  constructor(private readonly classListService: ClassListService) {}

  @Get()
  async findAll(): Promise<ClassList[]> {
    return this.classListService.findAll();
  }

  @Put()
  async createClass(@Body() data: Partial<ClassList>): Promise<ClassList> {
    return this.classListService.create(data);
  }

  @Get(':id/users')
  async listUsers(@Param() params: { id: number }): Promise<User[]> {
    return this.classListService.listUsers(params.id);
  }

  @Delete(':id')
  async destroy(@Param() params: { id: number }): Promise<void> {
    return this.classListService.remove(params.id);
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ClassList>,
  ): Promise<void> {
    return this.classListService.update(id, data);
  }

  @Put(':id/user')
  async createUser(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ): Promise<User> {
    return this.classListService.createUser(id, data);
  }

  @Post(':id/user')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ): Promise<User> {
    return this.classListService.updateUser(id, data);
  }

  @Delete(':id/user/:userID')
  async deleteUser(
    @Param('id') id: string,
    @Param('userID') userID: string,
  ): Promise<void> {
    return this.classListService.deleteUser(id, userID);
  }
}
