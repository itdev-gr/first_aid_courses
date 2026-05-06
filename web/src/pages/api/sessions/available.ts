import type { APIRoute } from 'astro';
import { listAvailableForProgram } from '../../../lib/firebase/sessions';

export const GET: APIRoute = async ({ url }) => {
  const programSlug = url.searchParams.get('program');
  if (!programSlug) {
    return new Response(JSON.stringify({ error: 'program param required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const sessions = await listAvailableForProgram(programSlug);
    const payload = sessions.map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      durationHours: s.durationHours,
      capacity: s.capacity,
      location: s.location,
      priceEur: s.priceEur,
    }));
    return new Response(JSON.stringify({ sessions: payload }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  } catch (err) {
    console.error('available sessions error', err);
    return new Response(JSON.stringify({ error: 'failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
