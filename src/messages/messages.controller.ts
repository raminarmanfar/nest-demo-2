import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Get()
  listMessages() {
    return this.messageService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
      return this.messageService.create(body.content);
  }

  @Get('/:id')
  async getMessageById(@Param('id') id: string) {
    const message = await this.messageService.findOne(id);

    if (!message) {
        throw new NotFoundException('Message not found.');
    }

    return message;
  }
}
