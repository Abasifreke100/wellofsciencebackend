import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reply, ReplyDocument } from './schema/reply.schema';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from './schema/comments.schema';
import { response } from 'express';
import {
  ReplyResponse,
  ReplyResponseDocument,
} from './schema/reply-response.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name)
    private replyModel: Model<ReplyDocument>,

    @InjectModel(ReplyResponse.name)
    private replyResponseModel: Model<ReplyResponseDocument>,

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

  async createReplyResponse(requestData) {
    const reply = await this.replyModel.findById(requestData.reply);

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    return await this.replyResponseModel.create({ ...requestData });
  }

  async delete(id) {
    const reply = await this.replyModel.findById(id);

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    await this.replyResponseModel.deleteMany({ reply: reply._id });

    await reply.deleteOne();

    return;
  }

  async deleteResponse(id) {
    const replyResponse = await this.replyResponseModel.findByIdAndDelete(id);

    if (!replyResponse) {
      throw new NotFoundException('Reply response not found');
    }

    return;
  }

  async paginateReplyResponse(id, query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const count = await this.replyResponseModel.countDocuments({ reply: id });
    const response = await this.replyResponseModel
      .find({ reply: id })
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
