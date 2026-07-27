'use client';

import { useState, useEffect } from 'react';

interface Relawan {
  id: number;
  namaLengkap: string;
  nik: string;
  email: string;
  jabatan: string;
  jenisKelamin: string;
  nomorHp: string;
  createdAt: string;
}

function escapeHtml(str: string) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function DaftarRelawan() {
  const [allData, setAllData] = useState<Relawan[]>([]);
  const [search, setSearch] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('');
  const [editItem, setEditItem] = useState<Relawan | null>(null);
  const [editForm, setEditForm] = useState({ namaLengkap: '', nik: '', email: '', jabatan: '', nomorHp: '' });
  const [loading, setLoading] = useState(true);

  const fetchRelawan = async () => {
    try {
      const res = await fetch('/api/relawan');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAllData(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRelawan(); }, []);

  const filtered = allData.filter((r) => {
    const matchSearch = !search ||
      r.namaLengkap?.toLowerCase().includes(search.toLowerCase()) ||
      r.nik?.includes(search) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchJabatan = !filterJabatan || r.jabatan === filterJabatan;
    return matchSearch && matchJabatan;
  });

  const openEdit = (item: Relawan) => {
    setEditItem(item);
    setEditForm({
      namaLengkap: item.namaLengkap || '',
      nik: item.nik || '',
      email: item.email || '',
      jabatan: item.jabatan || 'Persiapan',
      nomorHp: item.nomorHp || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    try {
      const res = await fetch('/api/relawan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editItem.id, ...editForm }),
      });
      const json = await res.json();
      if (json.success) {
        setEditItem(null);
        fetchRelawan();
      } else {
        alert('Gagal memperbarui: ' + json.message);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data relawan ini?')) return;
    try {
      const res = await fetch(`/api/relawan?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchRelawan();
      else alert('Gagal menghapus: ' + json.message);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const exportExcel = () => {
    if (!allData.length) return alert('Tidak ada data untuk diekspor.');
    const headers = ['ID', 'Nama Lengkap', 'NIK', 'Email', 'Divisi', 'Jenis Kelamin', 'Nomor HP'];
    const rows = allData.map((r) => [
      r.id,
      `"${(r.namaLengkap || '').replace(/"/g, '""')}"`,
      `"${r.nik || ''}"`,
      `"${r.email || ''}"`,
      `"${r.jabatan || ''}"`,
      `"${r.jenisKelamin || ''}"`,
      `"${r.nomorHp || ''}"`,
    ]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relawan_Dapur_SPPG_Pahlawan_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    if (!allData.length) return alert('Tidak ada data untuk diekspor.');
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relawan_Dapur_SPPG_Pahlawan_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Data Relawan Terdaftar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola data relawan Dapur SPPG Pahlawan.</p>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <div className="bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
            <span className="text-base font-extrabold text-slate-900 font-mono">{allData.length}</span>
          </div>
          <button onClick={exportExcel} className="shadcn-button bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 text-xs h-9 px-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
          <button onClick={exportJson} className="shadcn-button bg-indigo-700 hover:bg-indigo-800 text-white flex items-center gap-1.5 text-xs h-9 px-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Export JSON
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, NIK, atau email..."
            className="shadcn-input pl-9"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={filterJabatan} onChange={(e) => setFilterJabatan(e.target.value)} className="shadcn-input bg-white">
          <option value="">Semua Divisi Relawan</option>
          <option value="Persiapan">Persiapan</option>
          <option value="Pengolahan">Pengolahan</option>
          <option value="Pemorsian">Pemorsian</option>
          <option value="Distribusi">Distribusi</option>
          <option value="Kebersihan">Kebersihan</option>
          <option value="Cuci Ompreng">Cuci Ompreng</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Nama & NIK</th>
                <th className="px-4 py-3.5">Kontak</th>
                <th className="px-4 py-3.5">Divisi</th>
                <th className="px-4 py-3.5">Gender</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Memuat data relawan...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium">Tidak ada data relawan yang sesuai pencarian.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{escapeHtml(r.namaLengkap)}</div>
                      <div className="font-mono text-xs text-slate-400">{escapeHtml(r.nik)}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 text-xs">{escapeHtml(r.email)}</div>
                      <div className="font-mono text-xs text-slate-500">{escapeHtml(r.nomorHp)}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {escapeHtml(r.jabatan)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        {r.jenisKelamin === 'Laki-laki' ? '♂ Laki-laki' : '♀ Perempuan'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteItem(r.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Edit Data Relawan</h3>
              <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                <input type="text" value={editForm.namaLengkap} onChange={(e) => setEditForm({ ...editForm, namaLengkap: e.target.value })} required className="shadcn-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">NIK (16 Digit)</label>
                  <input type="text" value={editForm.nik} onChange={(e) => setEditForm({ ...editForm, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })} maxLength={16} required className="shadcn-input font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Divisi</label>
                  <select value={editForm.jabatan} onChange={(e) => setEditForm({ ...editForm, jabatan: e.target.value })} required className="shadcn-input">
                    <option value="Persiapan">Persiapan</option>
                    <option value="Pengolahan">Pengolahan</option>
                    <option value="Pemorsian">Pemorsian</option>
                    <option value="Distribusi">Distribusi</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Cuci Ompreng">Cuci Ompreng</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required className="shadcn-input" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor HP</label>
                  <input type="tel" value={editForm.nomorHp} onChange={(e) => setEditForm({ ...editForm, nomorHp: e.target.value })} required className="shadcn-input font-mono" />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" className="shadcn-button text-xs h-9 px-4">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
