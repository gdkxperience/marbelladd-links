import { Redis } from '@upstash/redis';

// One-time seed endpoint to import existing leads
// POST /api/seed with JSON body { leads: [...] }
// or GET /api/seed to import the hardcoded initial data

const INITIAL_LEADS = [
  { name: 'nikolina nedqlkova', email: 'mebelforyou.interior@gmail.com', phone: '', company: 'mebel for you wood', notes: '10% off accessories', timestamp: '2026-03-31T00:00:00.000Z' },
  { name: 'Natali Kukusheva', email: 'nataly_2000@abv.bg', phone: '', company: '', notes: '15% table', timestamp: '2026-03-31T00:00:00.000Z' },
  { name: 'Vesselina Andreeva', email: 'vessi71@mail.com', phone: '', company: 'Umbria Design Studio', notes: '-10%', timestamp: '2026-03-31T00:00:00.000Z' },
  { name: 'Darina Stoycheva', email: 'd.stoycheva@dozastudio.bg', phone: '', company: 'Doza Studio', notes: '', timestamp: '2026-03-31T00:00:00.000Z' },
  { name: 'Georgana Georgieva', email: 'zhivainteriors@gmail.com', phone: '', company: 'Doza Studio', notes: '', timestamp: '2026-03-31T00:00:00.000Z' },
];

export default async function handler(req, res) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  try {
    for (const lead of INITIAL_LEADS) {
      await redis.lpush('wheel_leads', JSON.stringify(lead));
      if (lead.email) {
        await redis.set(`wheel_email:${lead.email.toLowerCase().trim()}`, lead.notes || 'imported');
      }
    }
    return res.status(200).json({ status: 'ok', imported: INITIAL_LEADS.length });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
