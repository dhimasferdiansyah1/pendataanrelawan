import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistem Pendataan Relawan - Dapur SPPG Pahlawan',
  description: 'Sistem pendataan relawan Dapur SPPG Pahlawan untuk absensi online relawan BGN.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
