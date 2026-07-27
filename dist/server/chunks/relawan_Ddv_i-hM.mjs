import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as getGenderByName } from "./relawanList_DjNZOlwi.mjs";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
//#region src/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({ relawan: () => relawan });
var relawan = pgTable("relawan", {
	id: serial("id").primaryKey(),
	namaLengkap: text("nama_lengkap").notNull(),
	nik: varchar("nik", { length: 16 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull(),
	jabatan: varchar("jabatan", { length: 100 }).notNull(),
	jenisKelamin: varchar("jenis_kelamin", { length: 20 }).notNull(),
	nomorHp: varchar("nomor_hp", { length: 30 }).notNull(),
	alamatLengkap: text("alamat_lengkap").notNull(),
	tempatLahir: varchar("tempat_lahir", { length: 100 }).notNull(),
	tanggalLahir: varchar("tanggal_lahir", { length: 20 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var client = postgres(process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/pendataan_relawan", {
	max: 10,
	idle_timeout: 20,
	connect_timeout: 5,
	onnotice: () => {}
});
var db = drizzle(client, { schema: schema_exports });
var memoryStorage = [];
var nextId = 1;
async function checkDbConnection() {
	try {
		await client`SELECT 1`;
		return true;
	} catch (error) {
		return false;
	}
}
async function insertRelawan(data) {
	if (await checkDbConnection()) return {
		data: (await db.insert(relawan).values(data).returning())[0],
		mode: "postgres"
	};
	else {
		const newEntry = {
			id: nextId++,
			...data,
			createdAt: /* @__PURE__ */ new Date()
		};
		memoryStorage.unshift(newEntry);
		return {
			data: newEntry,
			mode: "memory"
		};
	}
}
async function getRelawanList() {
	if (await checkDbConnection()) return {
		data: (await db.select().from(relawan).orderBy(relawan.createdAt)).reverse(),
		mode: "postgres"
	};
	else return {
		data: memoryStorage,
		mode: "memory"
	};
}
async function deleteRelawan(id) {
	if (await checkDbConnection()) {
		await db.delete(relawan).where(eq(relawan.id, id));
		return {
			success: true,
			mode: "postgres"
		};
	} else {
		memoryStorage = memoryStorage.filter((item) => item.id !== id);
		return {
			success: true,
			mode: "memory"
		};
	}
}
async function updateRelawan(id, data) {
	if (await checkDbConnection()) return {
		data: (await db.update(relawan).set(data).where(eq(relawan.id, id)).returning())[0],
		mode: "postgres"
	};
	else {
		const index = memoryStorage.findIndex((item) => item.id === id);
		if (index !== -1) {
			memoryStorage[index] = {
				...memoryStorage[index],
				...data
			};
			return {
				data: memoryStorage[index],
				mode: "memory"
			};
		}
		throw new Error("Data relawan tidak ditemukan.");
	}
}
//#endregion
//#region src/pages/api/relawan.ts
var relawan_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async () => {
	try {
		const result = await getRelawanList();
		return new Response(JSON.stringify({
			success: true,
			data: result.data,
			mode: result.mode
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			message: error.message || "Gagal mengambil data relawan"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async ({ request }) => {
	try {
		let { namaLengkap, nik, email, jabatan, jenisKelamin, nomorHp, alamatLengkap, tempatLahir, tanggalLahir } = await request.json();
		if (!jenisKelamin && namaLengkap) jenisKelamin = getGenderByName(namaLengkap);
		if (!namaLengkap || !nik || !email || !jabatan || !nomorHp || !alamatLengkap || !tempatLahir || !tanggalLahir) return new Response(JSON.stringify({
			success: false,
			message: "Semua bidang input wajib diisi."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const cleanNik = String(nik).trim();
		if (!/^\d{16}$/.test(cleanNik)) return new Response(JSON.stringify({
			success: false,
			message: "NIK harus terdiri dari tepat 16 digit angka."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return new Response(JSON.stringify({
			success: false,
			message: "Format email tidak valid."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const result = await insertRelawan({
			namaLengkap: namaLengkap.trim(),
			nik: cleanNik,
			email: email.trim().toLowerCase(),
			jabatan: jabatan.trim(),
			jenisKelamin: jenisKelamin ? jenisKelamin.trim() : getGenderByName(namaLengkap),
			nomorHp: nomorHp.trim(),
			alamatLengkap: alamatLengkap.trim(),
			tempatLahir: tempatLahir.trim(),
			tanggalLahir: tanggalLahir.trim()
		});
		return new Response(JSON.stringify({
			success: true,
			message: "Data relawan berhasil didaftarkan!",
			data: result.data,
			mode: result.mode
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error.code === "23505" || error.message?.includes("unique constraint") || error.message?.includes("nik")) return new Response(JSON.stringify({
			success: false,
			message: "NIK sudah terdaftar dalam sistem."
		}), {
			status: 409,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			success: false,
			message: error.message || "Terjadi kesalahan saat menyimpan data."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var PUT = async ({ request }) => {
	try {
		const { id, ...data } = await request.json();
		if (!id) return new Response(JSON.stringify({
			success: false,
			message: "ID relawan wajib disertakan."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (data.namaLengkap && !data.jenisKelamin) data.jenisKelamin = getGenderByName(data.namaLengkap);
		const result = await updateRelawan(parseInt(id, 10), data);
		return new Response(JSON.stringify({
			success: true,
			message: "Data relawan berhasil diperbarui.",
			data: result.data,
			mode: result.mode
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			message: error.message || "Gagal memperbarui data"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var DELETE = async ({ request }) => {
	try {
		const idParam = new URL(request.url).searchParams.get("id");
		if (!idParam) return new Response(JSON.stringify({
			success: false,
			message: "ID relawan tidak ditemukan"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const result = await deleteRelawan(parseInt(idParam, 10));
		return new Response(JSON.stringify({
			success: true,
			message: "Data relawan berhasil dihapus",
			mode: result.mode
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			message: error.message || "Gagal menghapus data"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/relawan@_@ts
var page = () => relawan_exports;
//#endregion
export { page };
