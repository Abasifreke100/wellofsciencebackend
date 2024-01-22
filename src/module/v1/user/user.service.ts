import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { TokenService } from '../token/token.service';
import { RoleEnum } from '../../../common/constants/user.constants';
import { extractAdminData } from '../../../common/utils/response.';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  async findCurrentUser(user): Promise<UserDocument> {
    const userObj = await this.userModel.findById(user._id);

    // Extract user data based on role
    let userData;

    if (user.role === RoleEnum.ADMIN) {
      userData = await extractAdminData(userObj);
    }

    return userData;
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  async fullUserDetails(query: object): Promise<UserDocument> {
    return await this.userModel.findOne(query).select('+password');
  }

  async seedDefaultUser() {
    try {
      const admin = await this.userModel.findOne({
        role: RoleEnum.ADMIN,
      });

      if (admin) {
        throw new BadRequestException(`${admin.role} already exists`);
      }

      await this.userModel.create({
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@gmail.com',
        password: await this.hashData('password'),
        role: RoleEnum.ADMIN,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async logout(user: UserDocument) {
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        tokens: [],
      },
      { new: true },
    );
    await this.tokenService.logout(user._id);
  }
}
