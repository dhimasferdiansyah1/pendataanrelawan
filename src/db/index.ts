import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/pendataan_relawan';

// Create postgres connection client
export const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 5,
  onnotice: () => {}, // suppress notices
});

// Initialize Drizzle ORM instance
export const db = drizzle(client, { schema });

// In-memory fallback storage when PostgreSQL server is offline or unreachable
let memoryStorage: (typeof schema.relawan.$inferSelect)[] = [];
let nextId = 1;

export async function checkDbConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

export async function insertRelawan(data: typeof schema.relawan.$inferInsert) {
  const isConnected = await checkDbConnection();
  if (isConnected) {
    const result = await db.insert(schema.relawan).values(data).returning();
    return { data: result[0], mode: 'postgres' as const };
  } else {
    // Graceful fallback to memory storage with notice
    const newEntry = {
      id: nextId++,
      ...data,
      createdAt: new Date(),
    };
    memoryStorage.unshift(newEntry);
    return { data: newEntry, mode: 'memory' as const };
  }
}

export async function getRelawanList() {
  const isConnected = await checkDbConnection();
  if (isConnected) {
    const data = await db.select().from(schema.relawan).orderBy(schema.relawan.createdAt);
    // Reverse so newest first
    return { data: data.reverse(), mode: 'postgres' as const };
  } else {
    return { data: memoryStorage, mode: 'memory' as const };
  }
}

export async function deleteRelawan(id: number) {
  const isConnected = await checkDbConnection();
  if (isConnected) {
    await db.delete(schema.relawan).where(eq(schema.relawan.id, id));
    return { success: true, mode: 'postgres' as const };
  } else {
    memoryStorage = memoryStorage.filter(item => item.id !== id);
    return { success: true, mode: 'memory' as const };
  }
}

export async function updateRelawan(id: number, data: Partial<typeof schema.relawan.$inferInsert>) {
  const isConnected = await checkDbConnection();
  if (isConnected) {
    const result = await db.update(schema.relawan).set(data).where(eq(schema.relawan.id, id)).returning();
    return { data: result[0], mode: 'postgres' as const };
  } else {
    const index = memoryStorage.findIndex(item => item.id === id);
    if (index !== -1) {
      memoryStorage[index] = { ...memoryStorage[index], ...data };
      return { data: memoryStorage[index], mode: 'memory' as const };
    }
    throw new Error('Data relawan tidak ditemukan.');
  }
}


