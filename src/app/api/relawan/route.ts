import { NextRequest, NextResponse } from 'next/server';
import { insertRelawan, getRelawanList, deleteRelawan, updateRelawan } from '@/db/index';
import { getGenderByName } from '@/data/relawanList';

export async function GET() {
  try {
    const result = await getRelawanList();
    return NextResponse.json({ success: true, data: result.data, mode: result.mode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Gagal mengambil data relawan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { namaLengkap, nik, email, jabatan, jenisKelamin, nomorHp } = body;

    if (!jenisKelamin && namaLengkap) {
      jenisKelamin = getGenderByName(namaLengkap);
    }

    if (!namaLengkap || !nik || !email || !jabatan || !nomorHp) {
      return NextResponse.json({ success: false, message: 'Semua bidang input wajib diisi.' }, { status: 400 });
    }

    const cleanNik = String(nik).trim();
    if (!/^\d{16}$/.test(cleanNik)) {
      return NextResponse.json({ success: false, message: 'NIK harus terdiri dari tepat 16 digit angka.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid.' }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, message: 'Data relawan berhasil didaftarkan!', data: result.data, mode: result.mode }, { status: 201 });
  } catch (error: any) {
    if (error.code === '23505' || error.message?.includes('unique constraint') || error.message?.includes('nik')) {
      return NextResponse.json({ success: false, message: 'NIK sudah terdaftar dalam sistem.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan saat menyimpan data.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID relawan wajib disertakan.' }, { status: 400 });
    }

    if (data.namaLengkap && !data.jenisKelamin) {
      data.jenisKelamin = getGenderByName(data.namaLengkap);
    }

    const result = await updateRelawan(parseInt(id, 10), data);
    return NextResponse.json({ success: true, message: 'Data relawan berhasil diperbarui.', data: result.data, mode: result.mode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Gagal memperbarui data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ success: false, message: 'ID relawan tidak ditemukan' }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    const result = await deleteRelawan(id);
    return NextResponse.json({ success: true, message: 'Data relawan berhasil dihapus', mode: result.mode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Gagal menghapus data' }, { status: 500 });
  }
}
