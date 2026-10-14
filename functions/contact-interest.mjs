import { randomUUID } from 'node:crypto';

export async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  let payload;
  try { payload = await request.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const interest = String(payload.interest || '').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !interest) return json({ error: 'name_email_interest_required' }, 422);
  const event = { id: randomUUID(), type: 'saintgits.contact_interest.created', occurredAt: new Date().toISOString(), data: { name, email, interest } };
  console.log(JSON.stringify(event));
  return json({ accepted: true, requestId: event.id });
}
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }); }
