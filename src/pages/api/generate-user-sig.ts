import { NextApiRequest, NextApiResponse } from 'next';
import LibGenerateTestUserSig from '@/libs/lib-generate-test-usersig-es.min.js';

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 7 x 24 x 60 x 60 = 604800 = 7 days
 */
const EXPIRED_TIME = 60 * 60 * 24 * 7;

export default function handler(
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

    const generator = new LibGenerateTestUserSig(
      sdkAppId,
      secretKey,
      EXPIRED_TIME
    );
    
    const userSig = generator.genTestUserSig(userId);

    return res.status(200).json({
      sdkAppId,
      userSig,
    });
  } catch (error) {
    console.error('Error generating user signature:', error);
    return res.status(500).json({ error: 'Failed to generate user signature' });
  }
} 