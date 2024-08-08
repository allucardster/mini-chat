import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    response: string;
}