import DaftarRelawan from '@/components/DaftarRelawan';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3">
        <img src="/bgn.png" alt="Logo" className="h-8 w-auto" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Admin Panel - Pendataan Relawan</h1>
          <p className="text-xs text-slate-500">Kelola data relawan Dapur SPPG Pahlawan</p>
        </div>
      </div>

      <DaftarRelawan />

      <div className="max-w-6xl mx-auto mt-6 text-center">
        <a href="/" className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium underline underline-offset-4">
          ← Kembali ke halaman pendataan
        </a>
      </div>
    </main>
  );
}
