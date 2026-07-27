import FormRelawan from '@/components/FormRelawan';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-50">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <img src="/bgn.png" alt="Logo Dapur SPPG Pahlawan" className="h-16 w-auto object-contain" />
        <p className="text-xs text-slate-500 font-medium tracking-wide">Sistem Pendataan Relawan</p>
      </div>

      {/* Form Card */}
      <FormRelawan />

      {/* Login Admin link */}
      <div className="mt-8 text-center">
        <a href="/admin" className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium underline underline-offset-4">
          Login Admin
        </a>
      </div>
    </main>
  );
}
