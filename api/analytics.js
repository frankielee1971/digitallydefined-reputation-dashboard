// Vercel Serverless Function: /api/analytics
// Backend endpoint Hermes / the AI Business Partner can query for
// live website analytics. Proxies to the Supabase `analytics` Edge Function.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const SUPABASE_URL =
    process.env.VITE_SUPABASE_URL || 'https://dijjlppdljpcgyoakdnq.supabase.co';
  const EDGE_URL = `${SUPABASE_URL.replace(/\/+$/, '')}/functions/v1/analytics`;
  const API_KEY = process.env.VITE_DASHBOARD_API_KEY || '';
  if (!API_KEY) {
    console.error('[analytics-proxy] VITE_DASHBOARD_API_KEY is not set. Upstream may return 401.');
  }

  // Accept GET (?action=overview&days=30) or POST JSON.
  let action = 'overview';
  let days = 30;
  if (req.method === 'GET') {
    action = req.query.action || 'overview';
    days = Number(req.query.days || 30);
  } else if (req.method === 'POST') {
    action = req.body?.action || 'overview';
    days = Number(req.body?.days || 30);
  } else {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const response = await fetch(EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ action, days }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Request failed', message: error.message });
  }
}