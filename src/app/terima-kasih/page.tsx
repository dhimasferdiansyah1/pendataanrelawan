export default function TerimaKasih({ searchParams }: { searchParams: { nama?: string } }) {
  const nama = searchParams.nama || 'Relawan';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        {/* Logo */}
        <img src="/bgn.png" alt="Logo Dapur SPPG Pahlawan" className="h-14 w-auto object-contain mx-auto" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto border-2 border-emerald-200">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Terima Kasih!</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Atas nama <span className="font-bold text-slate-900">{nama}</span>,
            pendataan Anda telah berhasil disubmit.
          </p>
          <p className="text-xs text-slate-400">
            Data Anda akan digunakan untuk keperluan absensi online relawan BGN. Semangat bertugas!
          </p>
        </div>

        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4"
        >
          ← Kembali ke halaman pendataan
        </a>
      </div>
    </main>
  );
}
