import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      no_ready_check: true,
      auth_pass: process.env.REDIS_PASS,
      // password: process.env.REDIS_PASS || undefined,
    },
  },
} as ICacheConfig;
