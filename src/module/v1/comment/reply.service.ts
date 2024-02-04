import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reply, ReplyDocument } from './schema/reply.schema';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from './schema/comments.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name)
    private replyModel: Model<ReplyDocument>,

    @InjectModel(Comments.name)
    private commentsModel: Model<CommentsDocument>,
  ) {}

  async create(requestData) {
    const comments = await this.commentsModel.findOne({
      _id: requestData.comments,
    });

    if (!comments) {
      throw new NotFoundException('Comments not found');
    }

    return await this.replyModel.create({ ...requestData });
  }

  async update(id, requestData) {
    const reply = await this.replyModel.findByIdAndUpdate(
      id,
      { response: requestData.response },
      {
        new: true,
      },
    );

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    return reply;
  }

  async delete(id) {
    const post = await this.replyModel.findByIdAndDelete({
      _id: id,
    });

    if (!post) {
      throw new NotFoundException('Reply not found');
    }

    return;
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

    const count = await this.replyModel.countDocuments({ comments: id });
    const response = await this.replyModel
      .find({ comments: id })
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

}
