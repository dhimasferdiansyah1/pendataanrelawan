import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// In-memory fallback when DB is unreachable
let memoryStorage: (typeof schema.relawan.$inferSelect)[] = [];
let nextId = 1;

async function checkDb(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function insertRelawan(data: typeof schema.relawan.$inferInsert) {
  const ok = await checkDb();
  if (ok) {
    const result = await db.insert(schema.relawan).values(data).returning();
    return { data: result[0], mode: 'postgres' as const };
  }
  const entry = { id: nextId++, ...data, createdAt: new Date() } as any;
  memoryStorage.unshift(entry);
  return { data: entry, mode: 'memory' as const };
}

export async function getRelawanList() {
  const ok = await checkDb();
  if (ok) {
    const data = await db.select().from(schema.relawan).orderBy(schema.relawan.createdAt);
    return { data: data.reverse(), mode: 'postgres' as const };
  }
  return { data: memoryStorage, mode: 'memory' as const };
}

export async function deleteRelawan(id: number) {
  const ok = await checkDb();
  if (ok) {
    await db.delete(schema.relawan).where(eq(schema.relawan.id, id));
    return { success: true, mode: 'postgres' as const };
  }
  memoryStorage = memoryStorage.filter((item) => item.id !== id);
  return { success: true, mode: 'memory' as const };
}

export async function updateRelawan(id: number, data: Partial<typeof schema.relawan.$inferInsert>) {
  const ok = await checkDb();
  if (ok) {
    const result = await db.update(schema.relawan).set(data).where(eq(schema.relawan.id, id)).returning();
    return { data: result[0], mode: 'postgres' as const };
  }
  const idx = memoryStorage.findIndex((item) => item.id === id);
  if (idx !== -1) {
    memoryStorage[idx] = { ...memoryStorage[idx], ...data } as any;
    return { data: memoryStorage[idx], mode: 'memory' as const };
  }
  throw new Error('Data relawan tidak ditemukan.');
}
