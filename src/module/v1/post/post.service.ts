import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SpacesService } from '../spaces/spaces.service';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
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
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const count = await this.postModel.count();
    const response = await this.postModel
      .find()
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

    return post;
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
