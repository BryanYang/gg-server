import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, where } from 'sequelize';
import { Message } from 'src/models/message';
import { MessageTemplate } from 'src/models/message-templete';
import { map } from 'lodash';
import { User } from 'src/models/user';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(MessageTemplate)
    private messageTemplate: typeof MessageTemplate,
  ) {}
  async findAll(userID: number): Promise<Message[]> {
    const messages = await this.messageModel.findAll({
      where: {
        isDeleted: { [Op.eq]: null },
        userID: {
          [Op.or]: [String(userID), '-1'],
        },
      },
    });

    return Promise.all(
      map(messages, async (m) => {
        const template = await this.messageTemplate.findByPk(m.templateID);
        return { ...m.dataValues, template: template.dataValues };
      }),
    );
  }

  async findAllTemplates(): Promise<
    (MessageTemplate & {
      sendNames: string[];
    })[]
  > {
    const tems = await this.messageTemplate.findAll();
    return Promise.all(
      map(tems, async (tem) => {
        const messages = await this.messageModel.findAll({
          where: {
            templateID: tem.id,
          },
        });

        return {
          ...tem.dataValues,
          sendNames: map(messages, (m) => m.dataValues.description),
        };
      }),
    );
  }

  async create(data: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const messageTemplate = await this.messageTemplate.create(data);
    return messageTemplate;
  }

  async pub(data: { id: number; userIDs: number[] }): Promise<number> {
    const messageTemplate = await this.messageTemplate.findByPk(data.id);
    if (!messageTemplate) {
      return 0;
    }
    let num = 0;

    await Promise.all(
      map(data.userIDs, async (userID) => {
        const user =
          String(userID) === '-1'
            ? null
            : await this.userModel.findByPk(userID);
        await this.messageModel.create({
          userID,
          templateID: messageTemplate.id,
          state: 0,
          description: user ? user.username : '所有人',
        });
        num += 1;
      }),
    );
    return num;
  }

  async update(data: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const messageTemplate = await this.messageTemplate.findByPk(data.id);
    await messageTemplate.update(data);
    return messageTemplate;
  }

  async read(id: number, user: User): Promise<void> {
    const message = await this.messageModel.findByPk(id);
    if (!message || message.id !== user.id) {
      throw new Error('message 不存在');
    }
    await message.update({ state: 1 });
  }

  async delTemplate(id: number): Promise<void> {
    await this.messageTemplate.destroy({
      where: {
        id,
      },
    });
    await this.messageModel.destroy({
      where: {
        templateID: id,
      },
    });
  }
}
