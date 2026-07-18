import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/** Tipografía única de marca en todo Kova (landing + dashboard + portal). */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kova Talent OS',
  description: 'Plataforma de reclutamiento comercial especializado',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${manrope.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
