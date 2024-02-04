import { ReplyService } from './reply.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  REPLY_CREATED,
  REPLY_DELETED,
  REPLY_FETCH,
  REPLY_UPDATED,
} from '../../../common/constants/comments.constant';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @ResponseMessage(REPLY_CREATED)
  @Post()
  async create(@Body() requestData: CreateReplyDto) {
    return await this.replyService.create(requestData);
  }

  @ResponseMessage(REPLY_UPDATED)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData) {
    return await this.replyService.update(id, requestData);
  }

  @ResponseMessage(REPLY_DELETED)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.replyService.delete(id);
  }

  @ResponseMessage(REPLY_FETCH)
  @Get(':comment_id')
  @Public()
  async paginate(@Param('comment_id') comment_id: string, @Query() query) {
    return await this.replyService.paginate(comment_id, query);
  }
}
