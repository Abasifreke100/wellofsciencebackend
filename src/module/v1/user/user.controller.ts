import { Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ADMIN_SEEDER,
  DATA_FETCH,
  LOGGED_OUT,
} from '../../../common/constants/user.constants';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage(DATA_FETCH)
  @Get('me')
  async findCurrentUser(@Request() req) {
    return await this.userService.findCurrentUser(req.user);
  }

  @Public()
  @ResponseMessage(ADMIN_SEEDER)
  @Post('seeder')
  async seedDefaultUser() {
    return await this.userService.seedDefaultUser();
  }

  @ResponseMessage(LOGGED_OUT)
  @Post('logout')
  async logout(@Request() req) {
    await this.userService.logout(req.user);
    return null;
  }
}
