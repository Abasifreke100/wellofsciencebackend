import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from './schema/comments.schema';
import { Reply, ReplyDocument } from './schema/reply.schema';
import {
  ReplyResponse,
  ReplyResponseDocument,
} from './schema/reply-response.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private commentsModel: Model<CommentsDocument>,

    @InjectModel(Reply.name)
    private replyModel: Model<ReplyDocument>,

    @InjectModel(ReplyResponse.name)
    private replyResponseModel: Model<ReplyResponseDocument>,
  ) {}

  async create(requestData) {
    try {
      return await this.commentsModel.create({ ...requestData });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async paginate(id, query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const count = await this.commentsModel.countDocuments({ post: id });
    const response = await this.commentsModel
      .find({ post: id })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async delete(id) {
    // Find the comment
    const comment = await this.commentsModel.findById(id);

    // Check if the comment exists
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Find all replies associated with the comment
    const replies = await this.replyModel.find({ comments: id });

    // Loop through each reply to delete associated reply responses
    for (const reply of replies) {
      await this.replyResponseModel.deleteMany({ reply: reply._id });
    }

    // Delete all replies associated with the comment
    await this.replyModel.deleteMany({ comments: id });

    // Delete the comment
    await comment.deleteOne();

    return;
  }
}
