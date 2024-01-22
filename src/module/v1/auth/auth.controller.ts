import { Body, Controller, Post, Req } from '@nestjs/common';
import { LOGGED_IN } from 'src/common/constants/user.constants';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseMessage } from 'src/common/decorator/response.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage(LOGGED_IN)
  async login(@Body() requestPayload: LoginDto, @Req() req) {
    return await this.authService.login(requestPayload);
  }
}
