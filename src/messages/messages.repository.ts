import { Injectable } from "@nestjs/common";
import { readFileSync, writeFileSync } from "fs";

@Injectable()
export class MessagesRepository {
    async findOne(id: string) {
        const contents = await readFileSync('messages.json', 'utf8');
        const messages = JSON.parse(contents);
        return messages[id];
    }

    async findAll() {
        const contents = await readFileSync('messages.json', 'utf8');
        return JSON.parse(contents);
    }

    async create(content: string) {
        const contents = await readFileSync('messages.json', 'utf8');
        const messages = JSON.parse(contents);

        const id = Math.floor(Math.random() * 999);
        messages[id] = {id, content};
        await writeFileSync('messages.json', JSON.stringify(messages));
        return messages[id];
    }
}