import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const hasUrl = !!process.env.KV_REST_API_URL;
  const hasToken = !!process.env.KV_REST_API_TOKEN;

  if (!hasUrl || !hasToken) {
    return res.status(200).json({
      status: 'missing_env_vars',
      KV_REST_API_URL: hasUrl,
      KV_REST_API_TOKEN: hasToken,
    });
  }

  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    const count = await redis.llen('wheel_leads');
    const leads = await redis.lrange('wheel_leads', 0, 9);
    return res.status(200).json({ status: 'ok', total_leads: count, latest_10: leads });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
