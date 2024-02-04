import {
  Body,
  Controller,
  Get, Param,
  Post,
  Query
} from "@nestjs/common";
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { CommentsService } from './comments.service';
import { Public } from '../../../common/decorator/public.decorator';
import {
  COMMENTS_CREATED,
  COMMENTS_FETCH,
} from '../../../common/constants/comments.constant';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ResponseMessage(COMMENTS_CREATED)
  @Post()
  @Public()
  async create(@Body() requestData) {
    return await this.commentsService.create(requestData);
  }

  @ResponseMessage(COMMENTS_FETCH)
  @Get(':id')
  @Public()
  async paginate(@Param('id') id: string, @Query() query) {
    return await this.commentsService.paginate(id, query);
  }


}
