import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from 'src/models/message';
import { MessageTemplate } from 'src/models/message-templete';
import { User } from 'src/models/user';

@Module({
  imports: [SequelizeModule.forFeature([Message, MessageTemplate, User])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
