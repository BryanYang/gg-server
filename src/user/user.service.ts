import { Injectable } from '@nestjs/common';
import { map } from 'lodash';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user';
import { UserDto, convertToUserDTO } from '../dto/user';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.findAll();
    return map(users, convertToUserDTO);
  }

  async getUser(where: any): Promise<User> {
    return await this.userModel.findOne(where);
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    // 将 User 模型转换为 UserDto
    return convertToUserDTO(user);
  }

  async update(id: number, newData: Partial<User>): Promise<UserDto | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return null; // 用户不存在
    }

    await user.update(newData);
    return convertToUserDTO(user);
  }
}
