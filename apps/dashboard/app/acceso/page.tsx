import { LoginForm } from '../login/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso equipo | Kova',
  description: 'Acceso interno al panel comercial de Kova.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function StaffLoginPage() {
  return <LoginForm mode="staff" />;
}
