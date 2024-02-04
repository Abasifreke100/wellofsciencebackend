import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './schema/comments.schema';
import { Reply, ReplySchema } from './schema/reply.schema';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  providers: [CommentsService, ReplyService],
  controllers: [CommentsController, ReplyController],
})
export class CommentsModule {}
