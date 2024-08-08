import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    question: string;
}