import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { ChatCompletion } from 'openai/resources';

@Injectable()
export class OpenaiService {
    private readonly client: OpenAI;

    constructor(private readonly configService: ConfigService) {
        this.client = new OpenAI({apiKey: this.configService.get<string>('OPENAI_API_KEY')});
    }

    async getChatResponse(question: string): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: 'user', content: question }],
                model: 'gpt-3.5-turbo',
            });

            const [content] = completion.choices.map((choice) => choice.message.content);

            return content;
        } catch (error) {
            throw new ServiceUnavailableException('Unable to request to ChatGPT')
        }
    }
}
