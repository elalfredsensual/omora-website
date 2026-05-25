// ─────────────────────────────────────────────────────────────
//  Tiny "DB": JSON file on a Docker volume, in-memory cache.
//  All admin reads/writes go through this module.
// ─────────────────────────────────────────────────────────────

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Category, Purse } from '../data/purses';
import { seedPurses } from '../data/purses';

const DATA_DIR = process.env.DATA_DIR || './data';
const DATA_FILE = path.join(DATA_DIR, 'purses.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

let cache: Purse[] | null = null;

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function load(): Promise<Purse[]> {
  if (cache) return cache;
  await ensureDirs();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    cache = JSON.parse(raw) as Purse[];
  } catch {
    // First start: seed the data file from the catalogue baked into the image
    const now = new Date().toISOString();
    const seeded: Purse[] = seedPurses.map((p, i) => ({
      ...p,
      order: i * 10,
      createdAt: now,
      updatedAt: now,
    }));
    await persist(seeded);
    cache = seeded;
  }
  return cache;
}

async function persist(list: Purse[]) {
  await ensureDirs();
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
  cache = list;
}

function sortByOrder(list: Purse[]): Purse[] {
  return [...list].sort((a, b) => a.order - b.order);
}

/** Slugify text for ids and filenames. */
function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ───────── public queries ─────────

/** All purses (incl. hidden), ordered. For the admin panel. */
export async function listAll(): Promise<Purse[]> {
  return sortByOrder(await load());
}

/** Only the purses visitors should see (excludes hidden), ordered. */
export async function listPublic(): Promise<Purse[]> {
  const list = await load();
  return sortByOrder(list.filter((p) => p.status !== 'hidden'));
}

export async function findById(id: string): Promise<Purse | undefined> {
  return (await load()).find((p) => p.id === id);
}

/** Categories present in the public-facing list, in canonical order. */
export async function listPublicCategories(): Promise<Category[]> {
  const seen = new Set((await listPublic()).map((p) => p.category));
  return ['Carteras', 'Bolsos', 'Clutches', 'Mochilas'].filter((c) =>
    seen.has(c as Category),
  ) as Category[];
}

// ───────── mutations ─────────

export interface CreateInput {
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  status: Purse['status'];
}

export async function create(input: CreateInput): Promise<Purse> {
  const list = await load();
  const baseId = slug(input.name) || 'cartera';
  let id = baseId;
  let n = 2;
  while (list.some((p) => p.id === id)) {
    id = `${baseId}-${n++}`;
  }
  const maxOrder = list.reduce((m, p) => Math.max(m, p.order), 0);
  const now = new Date().toISOString();
  const purse: Purse = {
    id,
    ...input,
    order: maxOrder + 10,
    createdAt: now,
    updatedAt: now,
  };
  await persist([...list, purse]);
  return purse;
}

export async function update(
  id: string,
  patch: Partial<Omit<Purse, 'id' | 'createdAt'>>,
): Promise<Purse | undefined> {
  const list = await load();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) return undefined;
  const updated: Purse = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };
  const next = [...list];
  next[idx] = updated;
  await persist(next);
  return updated;
}

export async function remove(id: string): Promise<Purse | undefined> {
  const list = await load();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) return undefined;
  const removed = list[idx];
  await persist(list.filter((p) => p.id !== id));
  // best-effort delete of any uploaded images for this purse
  for (const img of removed.images) {
    await deleteUpload(img);
  }
  return removed;
}

// ───────── images ─────────

/** Save an uploaded image to the data volume. Returns the URL path. */
export async function saveUpload(
  file: File,
  hint = 'foto',
): Promise<string> {
  await ensureDirs();
  const ext =
    (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const base = slug(hint).slice(0, 30) || 'foto';
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const filename = `${base}-${stamp}.${ext}`;
  const dest = path.join(UPLOADS_DIR, filename);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, buf);
  return `/uploads/${filename}`;
}

/** Delete an uploaded image. Safely ignores baked-in /images/purses/* paths. */
export async function deleteUpload(urlPath: string): Promise<void> {
  if (!urlPath.startsWith('/uploads/')) return;
  const name = urlPath.slice('/uploads/'.length);
  if (name.includes('..') || name.includes('/')) return;
  try {
    await fs.unlink(path.join(UPLOADS_DIR, name));
  } catch {
    /* ignore missing */
  }
}

/** Read a file from the uploads volume. */
export async function readUpload(name: string): Promise<{ data: Buffer; type: string } | null> {
  if (name.includes('..') || name.includes('/') || name.includes('\\')) return null;
  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, name));
    const ext = path.extname(name).toLowerCase().slice(1);
    const type =
      ({
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
      } as Record<string, string>)[ext] || 'application/octet-stream';
    return { data, type };
  } catch {
    return null;
  }
}
