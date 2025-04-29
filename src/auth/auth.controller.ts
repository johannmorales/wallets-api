import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { RedisProvider } from './redis.provider';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private redisProvider: RedisProvider,
  ) {}

  @Public()
  @Post('signup')
  async singup(@Body() body: { email: string; password: string }) {
    return await this.authService.signup(body.email, body.password);
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body.email, body.password);
  }

  @ApiBearerAuth('access-token')
  @HttpCode(200)
  @Post('signout')
  async logout(@Req() req: Request) {
    const token = req.headers['authorization']!.split(' ')?.[1];

    try {
      const decoded = this.jwtService.verify(token);
      const expirationTime = decoded.exp;
      await this.redisProvider
        .getClient()
        .set(
          token,
          'blacklisted',
          'EX',
          Math.round((expirationTime * 1000 - Date.now()) / 1000),
        );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid token');
    }
  }
}
