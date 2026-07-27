'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { masterRelawanList } from '@/data/relawanList';

export default function FormRelawan() {
  const router = useRouter();
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = namaLengkap.trim()
    ? masterRelawanList.filter((i) => i.nama.toLowerCase().includes(namaLengkap.toLowerCase().trim()))
    : masterRelawanList;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectName = (nama: string, jk: string) => {
    setNamaLengkap(nama);
    setJenisKelamin(jk === 'L' ? 'Laki-laki' : 'Perempuan');
    setDropdownOpen(false);
  };

  const handleNamaChange = (val: string) => {
    setNamaLengkap(val);
    setDropdownOpen(true);
    const matched = masterRelawanList.find((i) => i.nama.toLowerCase() === val.toLowerCase().trim());
    if (matched) setJenisKelamin(matched.jk === 'L' ? 'Laki-laki' : 'Perempuan');
  };

  const handleNikChange = (val: string) => {
    setNik(val.replace(/\D/g, '').slice(0, 16));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      const res = await fetch('/api/relawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaLengkap, nik, email, jabatan, jenisKelamin, nomorHp }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        router.push(`/terima-kasih?nama=${encodeURIComponent(namaLengkap)}`);
      } else {
        setAlert({ type: 'error', message: json.message || 'Terjadi kesalahan saat memproses data.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Kesalahan sistem: ' + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setNamaLengkap('');
    setNik('');
    setEmail('');
    setNomorHp('');
    setJabatan('');
    setJenisKelamin('');
    setAlert(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Alert */}
      {alert && (
        <div className={`mb-5 p-3.5 rounded-xl text-sm font-medium border ${
          alert.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        <div className="p-6 space-y-5">

          {/* Nama Lengkap – searchable combobox */}
          <div className="space-y-1.5 relative" ref={containerRef}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => handleNamaChange(e.target.value)}
                onFocus={() => setDropdownOpen(true)}
                required
                autoComplete="off"
                placeholder="Cari nama relawan..."
                className="shadcn-input pr-9"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <svg className={`w-4 h-4 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto z-50 divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2.5 text-xs text-slate-400 italic">Nama tidak ditemukan dalam daftar.</div>
                ) : (
                  filtered.map((item) => (
                    <button
                      key={item.nama}
                      type="button"
                      onClick={() => selectName(item.nama, item.jk)}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800">{item.nama}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.jk === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {item.jk === 'L' ? 'L' : 'P'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* NIK */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                NIK <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs font-mono ${nik.length === 16 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                {nik.length}/16
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={nik}
                onChange={(e) => handleNikChange(e.target.value)}
                maxLength={16}
                required
                placeholder="16 digit NIK sesuai KTP"
                className="shadcn-input font-mono tracking-wider pr-9"
              />
              {nik.length === 16 && (
                <div className="absolute right-3 top-2.5">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@gmail.com"
              className="shadcn-input"
            />
          </div>

          {/* Nomor HP */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nomor HP <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={nomorHp}
              onChange={(e) => setNomorHp(e.target.value)}
              required
              placeholder="08xxxxxxxxxx"
              className="shadcn-input font-mono"
            />
          </div>

          {/* Divisi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Divisi <span className="text-rose-500">*</span>
            </label>
            <select value={jabatan} onChange={(e) => setJabatan(e.target.value)} required className="shadcn-input bg-white cursor-pointer">
              <option value="" disabled>Pilih divisi</option>
              <option value="Persiapan">Persiapan</option>
              <option value="Pengolahan">Pengolahan</option>
              <option value="Pemorsian">Pemorsian</option>
              <option value="Distribusi">Distribusi</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Cuci Ompreng">Cuci Ompreng</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="shadcn-button flex items-center gap-2 text-xs h-9 px-5"
          >
            <span>{submitting ? 'Mengirim...' : 'Kirim Pendataan'}</span>
            {submitting && (
              <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
