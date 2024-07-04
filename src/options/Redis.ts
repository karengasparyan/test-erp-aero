import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from 'redis';
import { NODE_ENV, REDIS_URL } from '../config';

class Redis {
  private static instance: Redis;
  private static exists: boolean = false;
  private readonly client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  constructor(private readonly url?: string | null) {
    this.client = createClient({
      url: this.url || REDIS_URL,
      socket: {
        connectTimeout: 10000
      }
    });

    !Redis.exists &&
      this.client
        .connect()
        .then(() => console.info(`Redis connected ${NODE_ENV}`))
        .catch((e: any) => console.error('Redis Client Error', e));
  }

  private connect(): Redis {
    if (!Redis.exists) {
      Redis.exists = true;
      Redis.instance = new Redis(this.url);
    }
    return Redis.instance;
  }

  public clientInit(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
    this.connect();
    return this.client;
  }
}

export const redisClient = new Redis().clientInit();
