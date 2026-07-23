import Link from 'next/link';
import { RiskJarGame } from '@/components/assessments/RiskJarGame';

export const metadata = {
  title: 'La jarra | Litt Hunter',
};

export default function DemoPruebaPage() {
  return (
    <div className="min-h-screen kova-shell-bg">
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[980px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[var(--kova-navy)]">La jarra</p>
          <Link href="/login" className="text-xs font-semibold text-[var(--kova-blue)] hover:underline shrink-0">
            Ir al portal
          </Link>
        </div>
      </div>
      <main className="max-w-[440px] mx-auto p-5 lg:p-8 kova-animate-in">
        <RiskJarGame showRecruiterReport />
      </main>
    </div>
  );
}
