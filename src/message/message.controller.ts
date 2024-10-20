import {
  Controller,
  UseGuards,
  Get,
  Put,
  Body,
  Post,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Message } from 'src/models/message';
import { MessageService } from './message.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { MessageTemplate } from 'src/models/message-templete';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async findAll(@Request() req): Promise<Message[]> {
    return this.messageService.findAll(req.user.id);
  }

  @Get('templates')
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async findAllTemplates(): Promise<MessageTemplate[]> {
    return this.messageService.findAllTemplates();
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async create(
    @Body() data: Partial<MessageTemplate>,
  ): Promise<MessageTemplate> {
    return this.messageService.create(data);
  }

  @Post('pub')
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async pub(@Body() data: { id: number; userIDs: number[] }): Promise<number> {
    return this.messageService.pub(data);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async update(
    @Body() data: Partial<MessageTemplate>,
  ): Promise<MessageTemplate> {
    return this.messageService.update(data);
  }

  @Post('/read/:id')
  async read(@Param() params: { id: number }, @Request() req): Promise<void> {
    return this.messageService.read(params.id, req.user);
  }

  @Post('templates/:id/delete')
  @UseGuards(RolesGuard)
  @Roles('teacher')
  async delTemplate(@Param() params: { id: number }): Promise<void> {
    return this.messageService.delTemplate(params.id);
  }
}
