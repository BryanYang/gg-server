import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Body,
  Request,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Message } from 'src/models/message';
import { MessageService } from './message.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Put()
  async create(@Body() data: Partial<Message>): Promise<Message> {
    return this.messageService.create(data);
  }

  @Post()
  async update(@Body() data: Partial<Message>): Promise<Message> {
    return this.messageService.create(data);
  }
}
