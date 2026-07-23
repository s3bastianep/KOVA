import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/** Tipografía única de marca en todo Litt Hunter (landing + dashboard + portal). */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Litt Hunter Talent OS',
    template: '%s | Litt Hunter',
  },
  description:
    'Litt Hunter Talent OS. Plataforma de reclutamiento comercial especializado en Colombia.',
  applicationName: 'Litt Hunter Talent OS',
  authors: [{ name: 'Litt Hunter' }],
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/favicon.png' }],
  },
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
