import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'lodash';
import { ClassListService } from './class-list.service';
import { ClassList } from 'src/models/class-list';
import { User } from 'src/models/user';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csv from 'csvtojson';
import { Readable } from 'stream';

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

  @Put(':id/users')
  async createUsers(
    @Param('id') id: string,
    @Body() data: Array<Partial<User>>,
  ): Promise<number> {
    let count = 0;
    for (const user of data) {
      await this.classListService.createUser(id, user);
      count++;
    }
    return count;
  }

  @Post(':id/user')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ): Promise<User> {
    return this.classListService.updateUser(id, data);
  }

  @Post(':id/upload')
  // 使用 FileInterceptor 拦截器来处理文件上传
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsers(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const stream = Readable.from(file.buffer);
    const res = await csv().fromStream(stream);
    return await Promise.all(
      map(res, async (user) => {
        if (user.username && user.email && user.password) {
          return await this.classListService.createUser(id, user);
        }
      }),
    );
  }

  @Delete(':id/user/:userID')
  async deleteUser(
    @Param('id') id: string,
    @Param('userID') userID: string,
  ): Promise<void> {
    return this.classListService.deleteUser(id, userID);
  }
}
