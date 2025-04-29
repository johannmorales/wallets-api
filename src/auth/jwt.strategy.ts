import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { RedisProvider } from './redis.provider';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly redisProvider: RedisProvider,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers?.['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    const isBlacklisted = await this.redisProvider.getClient().get(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    const { sub, email } = payload;

    const user = await this.userRepository.findOne({
      where: { id: sub, email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
