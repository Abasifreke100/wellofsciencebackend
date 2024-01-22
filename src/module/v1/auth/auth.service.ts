import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { generateIdentifier } from 'src/common/utils/uniqueId';
import { TokenService } from '../token/token.service';
import { User, UserDocument } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RoleEnum } from '../../../common/constants/user.constants';
import { extractAdminData } from '../../../common/utils/response.';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.fullUserDetails({ email });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new NotFoundException('Invalid login credentials');
    }
    return user;
  }

  async login(request: LoginDto) {
    const { email, password } = request;

    const user = await this.validateUser(email, password);

    const accessToken = this.jwtService.sign({
      _id: user._id,
      role: user.role,
      generator: generateIdentifier(),
    });

    await this.tokenService.create({ user: user._id, token: accessToken });

    let userData;

    if (user.role === RoleEnum.ADMIN) {
      userData = await extractAdminData(user);
    }

    return {
      userData,
      accessToken,
    };
  }
}
