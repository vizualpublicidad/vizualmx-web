import { createHmac, timingSafeEqual, randomUUID, createHash } from 'node:crypto';
const topics = { operations: 'Organizar mi operación', clinic: 'Digitalizar mi clínica', experience: 'Marca y presencia digital', infrastructure: 'Correo e infraestructura digital', guidance: 'Necesito orientación' };
const json = (data, status = 200, extra = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
const sign = value => createHmac('sha256', process.env.RESEND_API_KEY).update(`vizual-contact:${value}`).digest('hex');
const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.length <= max && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value);
export default { async fetch(request) {
  if (!['GET', 'POST'].includes(request.method)) return json({ message: 'Método no permitido.' }, 405, { Allow: 'GET, POST' });
  const domain = process.env.RESEND_EMAIL_DOMAIN;
  if (!process.env.RESEND_API_KEY || !domain || !/^[a-z0-9.-]+$/i.test(domain)) return json({ message: 'El envío no está disponible. Escríbenos a contacto@vizualmx.com.' }, 503);
  if (request.method === 'GET') {
    const value = `${Date.now()}.${randomUUID()}`;
    return json({ challenge: `${value}.${sign(value)}` });
  }
  const origin = request.headers.get('origin');
  const allowed = new Set(['https://vizualmx.com', 'https://www.vizualmx.com']);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) if (host) allowed.add(`https://${host}`);
  if (process.env.VERCEL_ENV === 'development') allowed.add(new URL(request.url).origin);
  if (!origin || !allowed.has(origin)) return json({ message: 'Solicitud no permitida.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ message: 'Formato no válido.' }, 415);
  if (Number(request.headers.get('content-length')) > 16000) return json({ message: 'El mensaje es demasiado largo.' }, 413);
  let data;
  try { const raw = await request.text(); if (Buffer.byteLength(raw) > 16000) return json({ message: 'El mensaje es demasiado largo.' }, 413); data = JSON.parse(raw); } catch { return json({ message: 'Revisa los datos del formulario.' }, 400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ message: 'Revisa los datos del formulario.' }, 400);
  if (data.website) return json({ message: 'Solicitud no válida.' }, 400);
  const parts = typeof data.challenge === 'string' ? data.challenge.split('.') : [];
  const [timestamp, id, signature] = parts;
  if (parts.length !== 3 || !/^\d{13}$/.test(timestamp) || !/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]{64}$/.test(signature) || !timingSafeEqual(Buffer.from(signature), Buffer.from(sign(`${timestamp}.${id}`)))) return json({ message: 'Actualiza la página e intenta de nuevo.', code: 'expired' }, 400);
  const age = Date.now() - Number(timestamp);
  if (age < 0 || age > 3600000) return json({ message: 'La sesión del formulario venció. Intenta enviarlo de nuevo.', code: 'expired' }, 400);
  if (age < 2000) return json({ message: 'Espera unos segundos y vuelve a enviar tu solicitud.' }, 429);
  if (!Object.hasOwn(topics, data.topic) || !validText(data.name,2,100) || !validText(data.company,2,120) || !validText(data.email,3,254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !validText(data.message,10,3000) || !validText(data.phone ?? '',0,30) || /[\r\n]/.test(data.email)) return json({ message: 'Revisa los campos obligatorios y el correo electrónico.' }, 400);
  const text = `Nueva solicitud desde vizualmx.com\n\nInterés: ${topics[data.topic]}\nNombre: ${data.name.trim()}\nEmpresa: ${data.company.trim()}\nCorreo: ${data.email.trim()}\nTeléfono: ${data.phone?.trim() || 'No proporcionado'}\n\nProyecto:\n${data.message.trim()}`;
  const key = createHash('sha256').update(`${id}:${text}`).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(12000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${key}` },
      body: JSON.stringify({ from: `VIZUAL Web <contacto@${domain}>`, to: ['contacto@vizualmx.com'], reply_to: data.email.trim(), subject: `Solicitud de diagnóstico · ${topics[data.topic]}`, text })
    });
    const result = await response.json();
    if (!response.ok || !result.id) {
      console.error('Contact email failed', response.status);
      return json({ message: 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos a contacto@vizualmx.com.' }, 502);
    }
    return json({ ok: true });
  } catch {
    console.error('Contact email network error');
    return json({ message: 'No pudimos confirmar el envío. Puedes intentar de nuevo sin duplicar la solicitud.' }, 502);
  }
} };
