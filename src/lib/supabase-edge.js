// lib/supabase-edge.js
// Shared helper for calling Supabase Edge Functions directly
// Replaces all Vercel Serverless Function proxies

const DEFAULT_SUPABASE_URL = 'https://dijjlppdljpcgyoakdnq.supabase.co';
// No hardcoded API key — fail loudly if env var missing

export const getSupabaseEdgeUrl = (functionName = 'hermes') => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL ||
                 import.meta.env.VITE_DASHBOARD_API_URL ||
                 DEFAULT_SUPABASE_URL;
  return `${baseUrl.replace(/\/+$/, '')}/functions/v1/${functionName}`;
};

export const getSupabaseEdgeHeaders = (extra = {}) => {
  const apiKey = import.meta.env.VITE_DASHBOARD_API_KEY;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!apiKey && import.meta.env.DEV) {
    console.warn('[Hermes] VITE_DASHBOARD_API_KEY is not set. Dashboard API calls will fail.');
  }
  if (!anonKey && import.meta.env.DEV) {
    console.warn('[Hermes] VITE_SUPABASE_ANON_KEY is not set. Edge Function auth may fail.');
  }
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(anonKey
      ? { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
      : {}),
    ...extra,
  };
};

export async function callSupabaseEdge(action, payload = {}, extraHeaders = {}) {
  const res = await fetch(getSupabaseEdgeUrl(), {
    method: 'POST',
    headers: getSupabaseEdgeHeaders(extraHeaders),
    body: JSON.stringify({ action, ...payload }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export default { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, callSupabaseEdge };
