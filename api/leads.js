import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const hasUrl = !!process.env.UPSTASH_REDIS_REST_URL;
  const hasToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!hasUrl || !hasToken) {
    return res.status(200).json({
      status: 'missing_env_vars',
      UPSTASH_REDIS_REST_URL: hasUrl,
      UPSTASH_REDIS_REST_TOKEN: hasToken,
    });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const count = await redis.llen('wheel_leads');
    const leads = await redis.lrange('wheel_leads', 0, 9);
    return res.status(200).json({ status: 'ok', total_leads: count, latest_10: leads });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
