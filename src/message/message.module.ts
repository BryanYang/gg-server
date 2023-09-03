import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from 'src/models/message';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
