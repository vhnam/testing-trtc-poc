import { NextApiRequest, NextApiResponse } from 'next';

import LibGenerateTestUserSig from '@/libs/lib-generate-test-usersig-es.min.js';
import { redis } from '@/libs/redis';

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 1 x 24 x 60 x 60 = 86400 = 1 day
 */
const EXPIRED_TIME = 60 * 60 * 24 * 1;

/**
 * Redis cache expiration time for userSig
 * Time unit: seconds
 * 30 minutes = 30 * 60 = 1800 seconds
 */
const REDIS_CACHE_EXPIRATION = 30 * 60;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const sdkAppId = parseInt(process.env.SDK_APP_ID as string);
    const secretKey = process.env.SDK_SECRET_KEY;

    if (!sdkAppId || !secretKey) {
      return res.status(500).json({ error: 'TRTC configuration not found' });
    }

    // Try to get userSig from Redis cache first
    const cacheKey = `userSig:${userId}`;
    let cachedUserSig: string | null = null;

    try {
      cachedUserSig = await redis.get(cacheKey);
    } catch (redisError) {
      console.warn(
        'Redis cache read failed, generating new userSig:',
        redisError
      );
    }

    let userSig: string;

    if (cachedUserSig) {
      // Return cached userSig
      console.log(`Using cached userSig for user: ${userId}`);
      userSig = cachedUserSig;
    } else {
      // Generate new userSig
      console.log(`Generating new userSig for user: ${userId}`);
      const generator = new LibGenerateTestUserSig(
        sdkAppId,
        secretKey,
        EXPIRED_TIME
      );

      userSig = generator.genTestUserSig(userId);

      // Store in Redis with 30-minute expiration
      try {
        await redis.setex(cacheKey, REDIS_CACHE_EXPIRATION, userSig);
        console.log(
          `Cached userSig for user: ${userId} (expires in 30 minutes)`
        );
      } catch (redisError) {
        console.warn('Redis cache write failed:', redisError);
        // Continue without caching - don't fail the request
      }
    }

    return res.status(200).json({
      sdkAppId,
      userSig,
      cached: !!cachedUserSig,
    });
  } catch (error) {
    console.error('Error generating user signature:', error);
    return res.status(500).json({ error: 'Failed to generate user signature' });
  }
}
