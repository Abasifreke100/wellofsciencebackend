import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpacesModule } from '../spaces/spaces.module';
import { Post, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    SpacesModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
