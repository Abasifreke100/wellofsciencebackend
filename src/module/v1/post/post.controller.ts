import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { DATA_FETCH, RoleEnum } from '../../../common/constants/user.constants';
import { Public } from '../../../common/decorator/public.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';
import {
  POST_CREATED,
  POST_DELETED,
  POST_LIKE,
  POST_UPDATED,
} from '../../../common/constants/post.constant';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ResponseMessage(POST_CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async create(
    @Body() requestData,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    return await this.postService.create(requestData, files);
  }

  @ResponseMessage(DATA_FETCH)
  @Public()
  @Get()
  async paginate(@Query() queryData) {
    return await this.postService.paginate(queryData);
  }

  @ResponseMessage(DATA_FETCH)
  @Public()
  @Get(':id')
  async getSinglePost(@Param('id') id: string) {
    return await this.postService.getSinglePost(id);
  }

  @ResponseMessage(POST_UPDATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() requestData,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    return await this.postService.update(id, requestData, files);
  }

  @ResponseMessage(POST_DELETED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }

  @ResponseMessage(POST_LIKE)
  @Public()
  @Post('/like/:id')
  async toggleLike(@Param('id') id: string, @Body() requestData) {
    return await this.postService.toggleLike(id, requestData);
  }
}
