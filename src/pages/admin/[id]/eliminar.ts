import type { APIRoute } from 'astro';
import { remove } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const id = params.id;
  if (id) {
    await remove(id);
  }
  return redirect('/admin', 302);
};
