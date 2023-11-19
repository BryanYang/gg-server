import { Injectable } from '@nestjs/common';
import { map } from 'lodash';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserDto, convertToUserDTO } from '../dto/user';
import { FindOptions } from 'sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(where?: FindOptions<User>): Promise<UserDto[]> {
    const users = await this.userModel.findAll(where);
    return map(users, convertToUserDTO);
  }

  async getUser(where: any): Promise<User> {
    return await this.userModel.findOne({
      where,
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    // 将 User 模型转换为 UserDto
    return user;
  }

  async update(id: number, newData: Partial<User>): Promise<UserDto | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return null; // 用户不存在
    }

    await user.update(newData);
    return convertToUserDTO(user);
  }

  async create(newData: Partial<User>): Promise<UserDto> {
    const salt = bcrypt.genSaltSync(10);
    const user = await this.userModel.create({
      ...newData,
      password: await bcrypt.hash(newData.password, salt),
    });

    return convertToUserDTO(user);
  }
}
