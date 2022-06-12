import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  public findOne(id: string) {
    return this.messagesRepository.findOne(id);
  }

  public findAll() {
    return this.messagesRepository.findAll();
  }

  public create(content: string) {
    return this.messagesRepository.create(content);
  }

}
