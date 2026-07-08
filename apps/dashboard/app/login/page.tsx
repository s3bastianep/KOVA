import { LoginForm } from './LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Kova',
  description: 'Acceso al panel comercial de Kova.',
};

// Evita que el login quede cacheado estáticamente por un año (s-maxage) y
// sirva credenciales/markup viejos tras un deploy.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return <LoginForm />;
}
