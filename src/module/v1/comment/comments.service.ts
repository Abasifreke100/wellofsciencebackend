import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from './schema/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private commentsModel: Model<CommentsDocument>,
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
}
