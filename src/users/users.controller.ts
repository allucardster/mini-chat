import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { OpenaiService } from 'src/openai/openai.service';
import { ChatDto } from './dto/chat.dto';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';

@Controller('users')
@UseGuards(PassportJwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly openaiService: OpenaiService) {}

  @Post('chat')
  async chat(@Body() input: ChatDto) {
    return this.openaiService.getChatResponse(input.question);
  }
}
