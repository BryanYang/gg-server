import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassList } from 'src/models/class-list';
import { User } from 'src/models/user';
import { map, forEach } from 'lodash';
import { convertToUserDTO } from 'src/dto/user';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClassListService {
  constructor(
    @InjectModel(ClassList) private classListModel: typeof ClassList,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(): Promise<ClassList[]> {
    const res = await this.classListModel.findAll({
      where: {
        isDeleted: {
          [Op.or]: [null, false],
        },
      },
    });

    const result = [];
    await Promise.all(
      map(res, async (c) => {
        c.dataValues.count = await this.userModel.count({
          where: {
            class: String(c.id),
          },
        });
        result.push(c);
      }),
    );

    return result;
  }

  async create(data: Partial<ClassList>): Promise<ClassList> {
    return await this.classListModel.create(data);
  }

  async listUsers(id: string | number): Promise<User[]> {
    const users = await this.userModel.findAll({
      where: {
        class: id,
      },
    });
    return map(users, convertToUserDTO);
  }

  async remove(id: string | number): Promise<void> {
    const it = await this.classListModel.findByPk(id);
    await it.update({ isDeleted: true });
  }

  async update(id: number | string, data: Partial<ClassList>) {
    const it = await this.classListModel.findByPk(id);
    await it.update(data);
  }

  async createUser(id: number | string, data: Partial<User>) {
    const _data = { ...data, class: String(id) };
    if (_data.password) {
      const salt = bcrypt.genSaltSync(10);
      _data.password = await bcrypt.hash(data.password, salt);
    }
    const it = await this.userModel.create(_data);
    return it;
  }

  async updateUser(id: number | string, data: Partial<User>) {
    const it = await this.userModel.findByPk(data.id);
    const _data = { ...data };
    if (_data.password) {
      const salt = bcrypt.genSaltSync(10);
      _data.password = await bcrypt.hash(data.password, salt);
    }

    await it.update(_data);
    return it;
  }

  async deleteUser(id: number | string, userID: number | string) {
    const it = await this.userModel.findOne({
      where: {
        id: userID,
        class: String(id),
      },
    });
    if (it) {
      it.destroy();
    }
  }
}
