import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsNotEmpty()
  @IsString()
  response: string;
}

export class ReplyResponseDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsString()
  response: string;
}
