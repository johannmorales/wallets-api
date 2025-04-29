import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!, 10),
    });
  }

  getClient() {
    return this.redisClient;
  }
}
