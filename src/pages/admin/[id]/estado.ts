import type { APIRoute } from 'astro';
import { update } from '../../../lib/db';
import type { PurseStatus } from '../../../data/purses';

export const prerender = false;

const VALID: PurseStatus[] = ['visible', 'out-of-stock', 'hidden'];

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const id = params.id;
  if (!id) return redirect('/admin', 302);
  const form = await request.formData();
  const status = String(form.get('status') || '') as PurseStatus;
  if (!VALID.includes(status)) return redirect('/admin', 302);
  await update(id, { status });
  return redirect('/admin', 302);
};
