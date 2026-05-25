import type { APIRoute } from 'astro';
import { readUpload } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const file = params.file;
  if (!file) {
    return new Response('Not found', { status: 404 });
  }
  const result = await readUpload(file);
  if (!result) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(result.data, {
    status: 200,
    headers: {
      'Content-Type': result.type,
      'Cache-Control': 'public, max-age=2592000',
    },
  });
};
