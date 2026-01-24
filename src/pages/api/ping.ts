import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'HEAD'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({ message: 'pong' });
}
