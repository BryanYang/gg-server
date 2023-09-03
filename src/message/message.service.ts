import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Message } from 'src/models/message';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message) private messageModel: typeof Message) {}
  async findAll(): Promise<Message[]> {
    return await this.messageModel.findAll({
      where: {
        isDeleted: { [Op.ne]: true },
      },
    });
  }

  async create(data: Partial<Message>): Promise<Message> {
    const message = await this.messageModel.create(data);
    return message;
  }

  async update(data: Partial<Message>): Promise<Message> {
    const message = await this.messageModel.findByPk(data.id);
    await message.update(data);
    return message;
  }
}
