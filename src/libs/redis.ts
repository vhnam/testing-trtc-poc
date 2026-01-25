import Redis from 'ioredis';

class RedisClient {
  private static instance: Redis | null = null;

  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      // Handle connection events
      this.instance.on('connect', () => {
        console.log('Redis client connected successfully');
      });

      this.instance.on('error', (error) => {
        console.error('Redis connection error:', error);
      });

      this.instance.on('close', () => {
        console.log('Redis connection closed');
      });
    }

    return this.instance;
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
      this.instance = null;
    }
  }
}

export const redis = RedisClient.getInstance();
export default RedisClient;