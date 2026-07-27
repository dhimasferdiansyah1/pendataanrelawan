import type { APIRoute } from 'astro';
import { insertRelawan, getRelawanList, deleteRelawan, updateRelawan } from '../../db/index';
import { getGenderByName } from '../../data/relawanList';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const result = await getRelawanList();
    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
        mode: result.mode,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Gagal mengambil data relawan',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    let {
      namaLengkap,
      nik,
      email,
      jabatan,
      jenisKelamin,
      nomorHp,
    } = body;

    // Auto assign jenisKelamin based on dataset if not explicitly passed
    if (!jenisKelamin && namaLengkap) {
      jenisKelamin = getGenderByName(namaLengkap);
    }

    // Validasi field wajib
    if (
      !namaLengkap ||
      !nik ||
      !email ||
      !jabatan ||
      !nomorHp
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Semua bidang input wajib diisi.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validasi NIK (harus 16 digit angka)
    const cleanNik = String(nik).trim();
    if (!/^\d{16}$/.test(cleanNik)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'NIK harus terdiri dari tepat 16 digit angka.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Format email tidak valid.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Simpan ke database
    const result = await insertRelawan({
      namaLengkap: namaLengkap.trim(),
      nik: cleanNik,
      email: email.trim().toLowerCase(),
      jabatan: jabatan.trim(),
      jenisKelamin: jenisKelamin ? jenisKelamin.trim() : getGenderByName(namaLengkap),
      nomorHp: nomorHp.trim(),
      alamatLengkap: '',
      tempatLahir: '',
      tanggalLahir: '',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data relawan berhasil didaftarkan!',
        data: result.data,
        mode: result.mode,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    if (error.code === '23505' || error.message?.includes('unique constraint') || error.message?.includes('nik')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'NIK sudah terdaftar dalam sistem.',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Terjadi kesalahan saat menyimpan data.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID relawan wajib disertakan.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (data.namaLengkap && !data.jenisKelamin) {
      data.jenisKelamin = getGenderByName(data.namaLengkap);
    }

    const result = await updateRelawan(parseInt(id, 10), data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data relawan berhasil diperbarui.',
        data: result.data,
        mode: result.mode,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Gagal memperbarui data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    if (!idParam) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID relawan tidak ditemukan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = parseInt(idParam, 10);
    const result = await deleteRelawan(id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data relawan berhasil dihapus',
        mode: result.mode,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Gagal menghapus data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
