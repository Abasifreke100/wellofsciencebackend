import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { SpacesService } from '../spaces/spaces.service';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { Like, LikeDocument } from './schema/like.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,

    @InjectModel(Like.name)
    private likeModel: Model<LikeDocument>,
    private spacesService: SpacesService,
  ) {}

  async create(requestData, files = null) {
    const [imageUrl] = await Promise.all([
      this.spacesService.uploadFile(files?.image?.length > 0 && files.image[0]),
    ]);

    const uploadUrls = {
      image: imageUrl,
    };

    const data = { ...requestData, ...uploadUrls };

    try {
      return await this.postModel.create(data);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async paginate(query: any) {
    let { currentPage, size, sort, name } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const nameQuery = name ? { name: { $regex: new RegExp(name, 'i') } } : {};

    const count = await this.postModel.countDocuments({
      ...query,
      ...nameQuery,
    });
    const response = await this.postModel
      .find({ ...query, ...nameQuery })
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

  async getSinglePost(id) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likes = await this.likeModel.find({ post: post._id });

    return { post, likes };
  }

  async toggleLike(postId, requestData) {
    const { status } = requestData;

    // Find the existing like document for the post
    const existingLike = await this.likeModel.findOne({ post: postId });

    if (existingLike) {
      // If the like document already exists, update the total based on the status
      if (status === 1) {
        existingLike.total += 1;
      } else if (status === 0 && existingLike.total > 0) {
        existingLike.total -= 1;
      }

      await existingLike.save();
    } else {
      // If the like document doesn't exist, create a new one
      const newLike = new this.likeModel({
        post: postId,
        total: status === 1 ? 1 : 0,
      });
      await newLike.save();
    }

    // Calculate the total likes for the post
    const totalLikes = await this.likeModel.aggregate([
      {
        $match: { post: new mongoose.Types.ObjectId(postId) },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$total' },
        },
      },
    ]);

    return { totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0 };
  }

  async update(id, requestData, files: any) {
    try {
      const imageUrl = files?.image
        ? await this.spacesService.uploadFile(files.image[0])
        : undefined;

      const uploadUrls = {
        ...(imageUrl && { image: imageUrl }),
        ...requestData,
      };

      const post = await this.postModel.findByIdAndUpdate(id, uploadUrls, {
        new: true,
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id) {
    const post = await this.postModel.findByIdAndDelete({
      _id: id,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return;
  }
}
