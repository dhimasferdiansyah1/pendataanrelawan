import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const relawan = pgTable('relawan', {
  id: serial('id').primaryKey(),
  namaLengkap: text('nama_lengkap').notNull(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  jabatan: varchar('jabatan', { length: 100 }).notNull(),
  jenisKelamin: varchar('jenis_kelamin', { length: 20 }).notNull(),
  nomorHp: varchar('nomor_hp', { length: 30 }).notNull(),
  alamatLengkap: text('alamat_lengkap'),
  tempatLahir: varchar('tempat_lahir', { length: 100 }),
  tanggalLahir: varchar('tanggal_lahir', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Relawan = typeof relawan.$inferSelect;
export type NewRelawan = typeof relawan.$inferInsert;
